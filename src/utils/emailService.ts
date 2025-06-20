
import { supabase } from "@/integrations/supabase/client";

export const sendConfirmationEmail = async (email: string, userName?: string) => {
  try {
    console.log('Sending confirmation email to:', email);
    
    // Generate confirmation URL using Supabase's built-in flow
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }

    console.log('Confirmation email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return { success: false, error };
  }
};

export const sendCustomConfirmationEmail = async (email: string, userName?: string, confirmationUrl?: string) => {
  try {
    console.log('Sending custom confirmation email to:', email);
    
    const { error } = await supabase.functions.invoke('send-user-email', {
      body: {
        type: 'confirmation',
        to: email,
        userName,
        confirmationUrl: confirmationUrl || `${window.location.origin}/`
      }
    });

    if (error) {
      console.error('Error sending custom confirmation email:', error);
      throw error;
    }

    console.log('Custom confirmation email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Failed to send custom confirmation email:', error);
    return { success: false, error };
  }
};
