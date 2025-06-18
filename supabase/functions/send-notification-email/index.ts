
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
  type: 'child_registration' | 'contact';
  data: any;
  recipientEmail: string;
  parentName?: string;
  childName?: string;
  contactName?: string;
  contactEmail?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Email notification function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data, recipientEmail, parentName, childName, contactName, contactEmail, message }: EmailRequest = await req.json();

    let emailSubject = "";
    let emailHtml = "";

    if (type === 'child_registration') {
      emailSubject = `New Child Registration - ${childName}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626; text-align: center;">New Child Registration Submitted</h1>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #059669; margin-bottom: 15px;">Child Information</h2>
            <p><strong>Child's Name:</strong> ${childName}</p>
            <p><strong>Age:</strong> ${data.age}</p>
            <p><strong>Gender:</strong> ${data.gender}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Story:</strong> ${data.story}</p>
            <p><strong>Wishes:</strong> ${data.wishes?.join(', ')}</p>
          </div>

          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #059669; margin-bottom: 15px;">Parent/Guardian Information</h2>
            <p><strong>Name:</strong> ${parentName}</p>
            <p><strong>Email:</strong> ${data.parentEmail}</p>
            <p><strong>Phone:</strong> ${data.parentPhone}</p>
            <p><strong>Relationship:</strong> ${data.relationship}</p>
            <p><strong>Household Size:</strong> ${data.householdSize}</p>
            <p><strong>Annual Income:</strong> ${data.annualIncome}</p>
            ${data.specialNeeds ? `<p><strong>Special Needs:</strong> ${data.specialNeeds}</p>` : ''}
            ${data.additionalInfo ? `<p><strong>Additional Info:</strong> ${data.additionalInfo}</p>` : ''}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">This registration requires review and approval.</p>
          </div>
        </div>
      `;
    } else if (type === 'contact') {
      emailSubject = `New Contact Form Submission - ${contactName}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626; text-align: center;">New Contact Form Submission</h1>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #059669; margin-bottom: 15px;">Contact Information</h2>
            <p><strong>Name:</strong> ${contactName}</p>
            <p><strong>Email:</strong> ${contactEmail}</p>
          </div>

          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #059669; margin-bottom: 15px;">Message</h2>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">Please respond to this inquiry promptly.</p>
          </div>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Candy Cane Kindness <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
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
