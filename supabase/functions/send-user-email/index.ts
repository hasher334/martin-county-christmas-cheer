
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'confirmation' | 'welcome' | 'password_reset';
  to: string;
  userName?: string;
  confirmationUrl?: string;
  resetUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, userName, confirmationUrl, resetUrl }: EmailRequest = await req.json();
    console.log(`Sending ${type} email to:`, to);

    let emailResponse;

    switch (type) {
      case 'confirmation':
        emailResponse = await resend.emails.send({
          from: "Candy Cane Kindness <noreply@candycanekindness.com>",
          to: [to],
          subject: "Please confirm your email - Candy Cane Kindness",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #166534; margin-bottom: 10px;">Welcome to Candy Cane Kindness!</h1>
                <p style="color: #374151; font-size: 18px;">Thanks for joining our Christmas mission</p>
              </div>
              
              <div style="background-color: #f0fdf4; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
                <h2 style="color: #166534; margin-bottom: 15px;">Confirm Your Email Address</h2>
                <p style="color: #374151; margin-bottom: 20px;">
                  Hi ${userName || 'there'}! We're excited to have you join our community of Christmas angels. 
                  To complete your registration and start adopting children for Christmas, please confirm your email address.
                </p>
                
                <div style="text-align: center; margin: 25px 0;">
                  <a href="${confirmationUrl}" 
                     style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; 
                            border-radius: 6px; font-weight: bold; display: inline-block;">
                    Confirm Email Address
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${confirmationUrl}" style="color: #2563eb; word-break: break-all;">${confirmationUrl}</a>
                </p>
              </div>
              
              <div style="margin-bottom: 25px;">
                <h3 style="color: #166534; margin-bottom: 15px;">What happens next?</h3>
                <ul style="color: #374151; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Once confirmed, you can browse children's Christmas wishlists</li>
                  <li style="margin-bottom: 8px;">Adopt a child and fulfill their Christmas dreams</li>
                  <li style="margin-bottom: 8px;">Join our community of Christmas giving</li>
                </ul>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                <p>This email was sent by Candy Cane Kindness</p>
                <p>If you didn't create an account with us, please ignore this email.</p>
              </div>
            </div>
          `,
        });
        break;

      case 'welcome':
        emailResponse = await resend.emails.send({
          from: "Candy Cane Kindness <noreply@candycanekindness.com>",
          to: [to],
          subject: "Welcome to Candy Cane Kindness! 🎄",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #166534; margin-bottom: 10px;">Welcome, ${userName || 'Christmas Angel'}! 🎄</h1>
                <p style="color: #374151; font-size: 18px;">Your account is now active and ready to spread Christmas joy!</p>
              </div>
              
              <div style="background-color: #fef3c7; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
                <h2 style="color: #92400e; margin-bottom: 15px;">Ready to Make Christmas Magic?</h2>
                <p style="color: #374151; margin-bottom: 20px;">
                  Thank you for confirming your email! You're now part of our amazing community of Christmas angels 
                  who help make the holidays special for children in need.
                </p>
                
                <div style="text-align: center; margin: 25px 0;">
                  <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}.lovableproject.com/wishlists" 
                     style="background-color: #166534; color: white; padding: 15px 30px; text-decoration: none; 
                            border-radius: 6px; font-weight: bold; display: inline-block;">
                    Browse Christmas Wishlists
                  </a>
                </div>
              </div>
              
              <div style="margin-bottom: 25px;">
                <h3 style="color: #166534; margin-bottom: 15px;">Here's how you can help:</h3>
                <ul style="color: #374151; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">🎁 Browse children's Christmas wishlists</li>
                  <li style="margin-bottom: 8px;">❤️ Adopt a child and purchase their gifts</li>
                  <li style="margin-bottom: 8px;">📞 Contact us if you need help or have questions</li>
                  <li style="margin-bottom: 8px;">🌟 Share our mission with friends and family</li>
                </ul>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                <p>Thank you for being part of Candy Cane Kindness!</p>
                <p>Together, we're making Christmas dreams come true. 🎄✨</p>
              </div>
            </div>
          `,
        });
        break;

      case 'password_reset':
        emailResponse = await resend.emails.send({
          from: "Candy Cane Kindness <noreply@candycanekindness.com>",
          to: [to],
          subject: "Reset your password - Candy Cane Kindness",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #166534; margin-bottom: 10px;">Password Reset Request</h1>
                <p style="color: #374151; font-size: 18px;">We received a request to reset your password</p>
              </div>
              
              <div style="background-color: #fef2f2; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
                <h2 style="color: #dc2626; margin-bottom: 15px;">Reset Your Password</h2>
                <p style="color: #374151; margin-bottom: 20px;">
                  Click the button below to reset your password. This link will expire in 1 hour for security.
                </p>
                
                <div style="text-align: center; margin: 25px 0;">
                  <a href="${resetUrl}" 
                     style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; 
                            border-radius: 6px; font-weight: bold; display: inline-block;">
                    Reset Password
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
                </p>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                <p>If you didn't request a password reset, please ignore this email.</p>
                <p>Your password will remain unchanged.</p>
              </div>
            </div>
          `,
        });
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-user-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
