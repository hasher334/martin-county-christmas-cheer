
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'child_registration' | 'contact' | 'adoption';
  data: any;
  parentName?: string;
  childName?: string;
  contactName?: string;
  contactEmail?: string;
  message?: string;
  donorName?: string;
  donorEmail?: string;
  adoptionNotes?: string;
}

// Use a verified sender email that should work with Resend
const adminEmails = ['arodseo@gmail.com', 'Krystidemario5@gmail.com'];
const senderEmail = 'hello@candycanekindness.com'; // This will need to be updated with your verified domain

const handler = async (req: Request): Promise<Response> => {
  console.log("Email notification function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data, parentName, childName, contactName, contactEmail, message, donorName, donorEmail, adoptionNotes }: EmailRequest = await req.json();

    let emailSubject = "";
    let emailHtml = "";

    if (type === 'child_registration') {
      emailSubject = `🎄 New Child Registration - ${childName}`;
      emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🎄 New Child Registration</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Candy Cane Kindness Platform</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #ecfdf5 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #059669;">
              <h2 style="color: #059669; margin: 0 0 20px 0; font-size: 22px; display: flex; align-items: center;">
                👧 Child Information
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 120px;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${childName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Age:</td><td style="padding: 8px 0; color: #1f2937;">${data.age} years old</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Gender:</td><td style="padding: 8px 0; color: #1f2937;">${data.gender}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Location:</td><td style="padding: 8px 0; color: #1f2937;">${data.location}</td></tr>
              </table>
              
              <div style="margin-top: 20px;">
                <h3 style="color: #059669; margin: 0 0 10px 0; font-size: 16px;">📖 Story:</h3>
                <p style="background-color: white; padding: 15px; border-radius: 8px; margin: 0; line-height: 1.6; color: #374151; border: 1px solid #e5e7eb;">${data.story}</p>
              </div>
              
              ${data.wishes && data.wishes.length > 0 ? `
                <div style="margin-top: 20px;">
                  <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 16px;">🎁 Christmas Wishes:</h3>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${data.wishes.map((wish: string) => `<span style="background-color: #fecaca; color: #991b1b; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">${wish}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <div style="background: linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #3b82f6;">
              <h2 style="color: #3b82f6; margin: 0 0 20px 0; font-size: 22px; display: flex; align-items: center;">
                👨‍👩‍👧‍👦 Parent/Guardian Information
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 140px;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${parentName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Email:</td><td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${data.parentEmail}" style="color: #3b82f6; text-decoration: none;">${data.parentEmail}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Phone:</td><td style="padding: 8px 0; color: #1f2937;">${data.parentPhone}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Relationship:</td><td style="padding: 8px 0; color: #1f2937;">${data.relationship}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Household Size:</td><td style="padding: 8px 0; color: #1f2937;">${data.householdSize} people</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Annual Income:</td><td style="padding: 8px 0; color: #1f2937;">${data.annualIncome}</td></tr>
              </table>
              
              ${data.specialNeeds ? `
                <div style="margin-top: 20px;">
                  <h3 style="color: #3b82f6; margin: 0 0 10px 0; font-size: 16px;">🏥 Special Needs:</h3>
                  <p style="background-color: white; padding: 15px; border-radius: 8px; margin: 0; line-height: 1.6; color: #374151; border: 1px solid #e5e7eb;">${data.specialNeeds}</p>
                </div>
              ` : ''}
              
              ${data.additionalInfo ? `
                <div style="margin-top: 20px;">
                  <h3 style="color: #3b82f6; margin: 0 0 10px 0; font-size: 16px;">ℹ️ Additional Information:</h3>
                  <p style="background-color: white; padding: 15px; border-radius: 8px; margin: 0; line-height: 1.6; color: #374151; border: 1px solid #e5e7eb;">${data.additionalInfo}</p>
                </div>
              ` : ''}
            </div>

            <div style="background-color: #fef3c7; padding: 20px; border-radius: 12px; text-align: center; border: 2px dashed #f59e0b;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">⚡ Action Required</h3>
              <p style="color: #92400e; margin: 0; font-weight: 500;">This registration requires review and approval.</p>
            </div>
          </div>

          <div style="background-color: #374151; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: white; margin: 0; font-size: 14px;">
              🎄 Candy Cane Kindness - Spreading joy one child at a time
            </p>
          </div>
        </div>
      `;
    } else if (type === 'contact') {
      emailSubject = `📧 New Contact Form Submission - ${contactName}`;
      emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">📧 New Contact Message</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Candy Cane Kindness Platform</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <div style="background: linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #3b82f6;">
              <h2 style="color: #3b82f6; margin: 0 0 20px 0; font-size: 22px;">👤 Contact Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 80px;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${contactName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Email:</td><td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${contactEmail}" style="color: #3b82f6; text-decoration: none;">${contactEmail}</a></td></tr>
              </table>
            </div>

            <div style="background: linear-gradient(135deg, #fef3c7 0%, #ecfdf5 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #059669;">
              <h2 style="color: #059669; margin: 0 0 15px 0; font-size: 22px;">💬 Message</h2>
              <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                <p style="margin: 0; line-height: 1.6; color: #374151; white-space: pre-wrap;">${message}</p>
              </div>
            </div>

            <div style="background-color: #fecaca; padding: 20px; border-radius: 12px; text-align: center; border: 2px dashed #dc2626;">
              <h3 style="color: #991b1b; margin: 0 0 10px 0; font-size: 18px;">⚡ Action Required</h3>
              <p style="color: #991b1b; margin: 0; font-weight: 500;">Please respond to this inquiry promptly.</p>
            </div>
          </div>

          <div style="background-color: #374151; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: white; margin: 0; font-size: 14px;">
              🎄 Candy Cane Kindness - Spreading joy one child at a time
            </p>
          </div>
        </div>
      `;
    } else if (type === 'adoption') {
      emailSubject = `❤️ New Child Adoption - ${childName}`;
      emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #ec4899 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">❤️ Child Adoption Notification</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Candy Cane Kindness Platform</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #ec4899;">
              <h2 style="color: #ec4899; margin: 0 0 20px 0; font-size: 22px;">👧 Child Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 80px;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${childName}</td></tr>
              </table>
            </div>

            <div style="background: linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #3b82f6;">
              <h2 style="color: #3b82f6; margin: 0 0 20px 0; font-size: 22px;">🎅 Donor Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 80px;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${donorName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Email:</td><td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${donorEmail}" style="color: #3b82f6; text-decoration: none;">${donorEmail}</a></td></tr>
              </table>
              
              ${adoptionNotes ? `
                <div style="margin-top: 20px;">
                  <h3 style="color: #3b82f6; margin: 0 0 10px 0; font-size: 16px;">📝 Notes:</h3>
                  <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <p style="margin: 0; line-height: 1.6; color: #374151; white-space: pre-wrap;">${adoptionNotes}</p>
                  </div>
                </div>
              ` : ''}
            </div>

            <div style="background-color: #dcfce7; padding: 20px; border-radius: 12px; text-align: center; border: 2px dashed #16a34a;">
              <h3 style="color: #15803d; margin: 0 0 10px 0; font-size: 18px;">🎉 Great News!</h3>
              <p style="color: #15803d; margin: 0; font-weight: 500;">A generous donor has adopted this child for Christmas!</p>
            </div>
          </div>

          <div style="background-color: #374151; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: white; margin: 0; font-size: 14px;">
              🎄 Candy Cane Kindness - Spreading joy one child at a time
            </p>
          </div>
        </div>
      `;
    }

    console.log("Attempting to send email with Resend...");
    console.log("Sender email:", senderEmail);
    console.log("Admin emails:", adminEmails);

    // Try to send the email with better error handling
    try {
      const emailResponse = await resend.emails.send({
        from: `Candy Cane Kindness <${senderEmail}>`,
        to: adminEmails,
        subject: emailSubject,
        html: emailHtml,
      });

      if (emailResponse.error) {
        console.error("Resend API error:", emailResponse.error);
        
        // If domain verification is the issue, try with the default testing email
        if (emailResponse.error.message && emailResponse.error.message.includes('domain')) {
          console.log("Domain verification issue detected, falling back to default sender...");
          
          const fallbackResponse = await resend.emails.send({
            from: "Candy Cane Kindness <onboarding@resend.dev>",
            to: ["anthony@smileconference.com"], // Use the verified testing email
            subject: emailSubject + " [TESTING MODE]",
            html: emailHtml + `
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #856404; margin: 0 0 10px 0;">⚠️ Testing Mode</h3>
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  This email was sent in testing mode. In production, it would be sent to: ${adminEmails.join(', ')}
                </p>
              </div>
            `,
          });

          console.log("Fallback email sent successfully:", fallbackResponse);
          
          return new Response(JSON.stringify({ 
            success: true, 
            emailResponse: fallbackResponse,
            note: "Email sent in testing mode to verified address" 
          }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          });
        }
        
        throw new Error(`Resend API error: ${emailResponse.error.message}`);
      }

      console.log("Email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ success: true, emailResponse }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });

    } catch (resendError) {
      console.error("Error sending email with Resend:", resendError);
      throw resendError;
    }

  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Please check if your domain is verified in Resend and the API key is valid" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
