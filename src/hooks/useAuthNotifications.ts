
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
                // Check if this is a new user (sign up) by looking at user metadata
                const isNewUser = session.user.user_metadata?.iss === undefined || 
                                  session.user.email_confirmed_at === session.user.created_at;
                
                if (isNewUser) {
                  await notifyUserSignup(
                    session.user.email,
                    session.user.user_metadata?.full_name || session.user.user_metadata?.name
                  );
                } else {
                  await notifyAuthEvent(
                    'user_signin', 
                    session.user.email, 
                    'User successfully signed in'
                  );
                }
              }
              break;

            case 'SIGNED_OUT':
              // Note: session will be null for sign out, so we can't get user email here
              // We handle this in the sign out function instead
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
