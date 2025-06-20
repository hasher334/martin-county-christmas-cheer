
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { notifyUserSignup, notifyAuthEvent, notifySystemEvent } from '@/utils/notificationService';

export const useAuthNotifications = () => {
  useEffect(() => {
    // Set up auth state listener with notifications
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);

        try {
          switch (event) {
            case 'SIGNED_IN':
              if (session?.user?.email) {
                // Check if this is a new user by looking at creation time vs confirmation time
                const user = session.user;
                const createdAt = new Date(user.created_at);
                const now = new Date();
                const timeDiff = now.getTime() - createdAt.getTime();
                const isRecentSignup = timeDiff < 5 * 60 * 1000; // 5 minutes
                
                console.log('User created at:', user.created_at);
                console.log('Time difference (ms):', timeDiff);
                console.log('Is recent signup:', isRecentSignup);
                console.log('Email confirmed at:', user.email_confirmed_at);
                
                // If the user was created very recently, treat as signup
                if (isRecentSignup && user.email_confirmed_at) {
                  console.log('Sending user signup notification for:', user.email);
                  await notifyUserSignup(
                    user.email,
                    user.user_metadata?.full_name || user.user_metadata?.name,
                    // Try to get IP from session or use placeholder
                    '(IP not available in client)'
                  );
                } else {
                  console.log('Sending user signin notification for:', user.email);
                  await notifyAuthEvent(
                    'user_signin', 
                    user.email, 
                    'User successfully signed in'
                  );
                }
              }
              break;

            case 'SIGNED_UP':
              console.log('SIGNED_UP event detected');
              if (session?.user?.email) {
                console.log('Sending signup notification for SIGNED_UP event:', session.user.email);
                await notifyUserSignup(
                  session.user.email,
                  session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                  '(IP not available in client)'
                );
              }
              break;

            case 'SIGNED_OUT':
              // Note: session will be null for sign out, so we can't get user email here
              // We handle this in the sign out function instead
              console.log('User signed out');
              await notifySystemEvent('user_signout', 'User session ended');
              break;

            case 'PASSWORD_RECOVERY':
              if (session?.user?.email) {
                await notifyAuthEvent(
                  'password_recovery', 
                  session.user.email, 
                  'User requested password recovery'
                );
              }
              break;

            case 'TOKEN_REFRESHED':
              if (session?.user?.email) {
                await notifyAuthEvent(
                  'token_refresh', 
                  session.user.email, 
                  'User session token refreshed'
                );
              }
              break;

            case 'USER_UPDATED':
              if (session?.user?.email) {
                await notifyAuthEvent(
                  'user_updated', 
                  session.user.email, 
                  'User profile updated'
                );
              }
              break;

            default:
              console.log('Unhandled auth event:', event);
              if (session?.user?.email) {
                await notifyAuthEvent(
                  `auth_${event.toLowerCase()}`, 
                  session.user.email, 
                  `Authentication event: ${event}`
                );
              }
              break;
          }
        } catch (error) {
          console.error('Error sending auth notification:', error);
          // Don't throw the error to avoid disrupting the auth flow
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);
};
