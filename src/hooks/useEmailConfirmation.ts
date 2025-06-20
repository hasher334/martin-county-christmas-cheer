
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Check if we have confirmation tokens in the URL
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      
      console.log('Email confirmation check:', { token_hash, type });

      if (token_hash && type) {
        try {
          console.log('Processing email confirmation...');
          
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            console.error('Email confirmation error:', error);
            toast({
              title: "Email Confirmation Failed",
              description: error.message || "There was an error confirming your email. Please try again.",
              variant: "destructive",
            });
            return;
          }

          if (data.user) {
            console.log('Email confirmed successfully for user:', data.user.email);
            
            // Send welcome email
            try {
              await supabase.functions.invoke('send-user-email', {
                body: {
                  type: 'welcome',
                  to: data.user.email,
                  userName: data.user.user_metadata?.name || data.user.user_metadata?.full_name,
                }
              });
            } catch (emailError) {
              console.error('Error sending welcome email:', emailError);
              // Don't show error to user for welcome email failure
            }

            toast({
              title: "Email Confirmed! 🎄",
              description: "Welcome to Candy Cane Kindness! You can now browse and adopt children for Christmas.",
            });

            // Clean up URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('Unexpected error during email confirmation:', error);
          toast({
            title: "Email Confirmation Error",
            description: "An unexpected error occurred. Please try again or contact support.",
            variant: "destructive",
          });
        }
      }
    };

    handleEmailConfirmation();
  }, [searchParams, toast]);
};
