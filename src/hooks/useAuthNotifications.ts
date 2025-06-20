
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { notifyAuthEvent } from '@/utils/notificationService';

export const useAuthNotifications = () => {
  const initializeRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initializeRef.current) {
      console.log('Auth notifications already initialized, skipping');
      return;
    }
    
    initializeRef.current = true;
    console.log('Initializing auth notifications');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user;
      
      if (event === 'SIGNED_IN' && user?.email) {
        console.log('Auth event:', event, user.email);
        
        // Check if this is a recent signup (within 5 minutes)
        const userCreatedAt = new Date(user.created_at).getTime();
        const timeDifference = Date.now() - userCreatedAt;
        const isRecentSignup = timeDifference < 5 * 60 * 1000; // 5 minutes
        
        if (isRecentSignup) {
          console.log('Sending user signup notification for:', user.email);
          await notifyAuthEvent('user_signup', user.email, 'New user successfully signed up');
        } else {
          console.log('Sending user signin notification for:', user.email);
          await notifyAuthEvent('user_signin', user.email, 'User successfully signed in');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('Auth event: SIGNED_OUT');
      }
    });

    return () => {
      console.log('Cleaning up auth notifications');
      subscription.unsubscribe();
      initializeRef.current = false;
    };
  }, []);
};
