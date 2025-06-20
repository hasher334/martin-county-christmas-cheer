
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { notifyAuthEvent } from '@/utils/notificationService';

export const useAuthNotifications = () => {
  const lastEventRef = useRef<{ event: string; userId: string; timestamp: number } | null>(null);
  const initializeRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initializeRef.current) return;
    initializeRef.current = true;

    console.log('Initializing auth notifications');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user;
      
      // Prevent duplicate events within 1 second
      const now = Date.now();
      const currentEvent = {
        event,
        userId: user?.id || '',
        timestamp: now
      };

      if (lastEventRef.current && 
          lastEventRef.current.event === event && 
          lastEventRef.current.userId === currentEvent.userId &&
          (now - lastEventRef.current.timestamp) < 1000) {
        console.log('Skipping duplicate auth event:', event);
        return;
      }

      lastEventRef.current = currentEvent;

      if (event === 'SIGNED_IN' && user?.email) {
        console.log('Auth event:', event, user.email);
        
        // Check if this is a recent signup (within 5 minutes)
        const userCreatedAt = new Date(user.created_at).getTime();
        const timeDifference = now - userCreatedAt;
        const isRecentSignup = timeDifference < 5 * 60 * 1000; // 5 minutes
        
        console.log('User created at:', user.created_at);
        console.log('Time difference (ms):', timeDifference);
        console.log('Is recent signup:', isRecentSignup);

        if (user.email_confirmed_at) {
          console.log('Email confirmed at:', user.email_confirmed_at);
        }

        if (isRecentSignup) {
          console.log('Sending user signup notification for:', user.email);
          await notifyAuthEvent('user_signup', user.email, 'New user successfully signed up');
        } else {
          console.log('Sending user signin notification for:', user.email);
          await notifyAuthEvent('user_signin', user.email, 'User successfully signed in');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('Auth event: SIGNED_OUT');
        // Note: user is null when signed out, so we can't get email
        // We would need to store the email before sign out if we want to track it
      }
    });

    return () => {
      console.log('Cleaning up auth notifications');
      subscription.unsubscribe();
      initializeRef.current = false;
    };
  }, []);
};
