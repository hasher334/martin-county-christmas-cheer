
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
  type: 'child_registration' | 'contact' | 'adoption' | 'user_signup' | 'auth_event' | 'analytics_summary' | 'system_event' | 'admin_activity';
  data: any;
  parentName?: string;
  childName?: string;
  contactName?: string;
  contactEmail?: string;
  message?: string;
  donorName?: string;
  donorEmail?: string;
  adoptionNotes?: string;
  // New fields for additional notification types
  userEmail?: string;
  userName?: string;
  eventType?: string;
  eventDescription?: string;
  analyticsData?: any;
  systemEventType?: string;
  adminUser?: string;
  adminAction?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: string;
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
    const emailRequest: EmailRequest = await req.json();
    const { type, data } = emailRequest;

    let emailSubject = "";
    let emailHtml = "";

    if (type === 'child_registration') {
      emailSubject = `🎄 New Child Registration - ${emailRequest.childName}`;
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
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 120px;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.childName}</td></tr>
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
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 140px;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.parentName}</td></tr>
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
      emailSubject = `📧 New Contact Form Submission - ${emailRequest.contactName}`;
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
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 80px;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.contactName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Email:</td><td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${emailRequest.contactEmail}" style="color: #3b82f6; text-decoration: none;">${emailRequest.contactEmail}</a></td></tr>
              </table>
            </div>

            <div style="background: linear-gradient(135deg, #fef3c7 0%, #ecfdf5 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #059669;">
              <h2 style="color: #059669; margin: 0 0 15px 0; font-size: 22px;">💬 Message</h2>
              <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                <p style="margin: 0; line-height: 1.6; color: #374151; white-space: pre-wrap;">${emailRequest.message}</p>
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
      emailSubject = `❤️ New Child Adoption - ${emailRequest.childName}`;
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
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 80px;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.childName}</td></tr>
              </table>
            </div>

            <div style="background: linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #3b82f6;">
              <h2 style="color: #3b82f6; margin: 0 0 20px 0; font-size: 22px;">🎅 Donor Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 80px;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.donorName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Email:</td><td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${emailRequest.donorEmail}" style="color: #3b82f6; text-decoration: none;">${emailRequest.donorEmail}</a></td></tr>
              </table>
              
              ${emailRequest.adoptionNotes ? `
                <div style="margin-top: 20px;">
                  <h3 style="color: #3b82f6; margin: 0 0 10px 0; font-size: 16px;">📝 Notes:</h3>
                  <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <p style="margin: 0; line-height: 1.6; color: #374151; white-space: pre-wrap;">${emailRequest.adoptionNotes}</p>
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
    } else if (type === 'user_signup') {
      emailSubject = `👤 New User Registration - ${emailRequest.userEmail}`;
      emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #059669 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">👤 New User Registration</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Candy Cane Kindness Platform</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #dbeafe 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #059669;">
              <h2 style="color: #059669; margin: 0 0 20px 0; font-size: 22px;">👤 User Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 120px;">Email:</td><td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${emailRequest.userEmail}" style="color: #059669; text-decoration: none;">${emailRequest.userEmail}</a></td></tr>
                ${emailRequest.userName ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.userName}</td></tr>` : ''}
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Registration Time:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.timestamp || new Date().toLocaleString()}</td></tr>
                ${emailRequest.ipAddress ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">IP Address:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.ipAddress}</td></tr>` : ''}
              </table>
            </div>

            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 12px; text-align: center; border: 2px dashed #16a34a;">
              <h3 style="color: #15803d; margin: 0 0 10px 0; font-size: 18px;">🎉 Welcome!</h3>
              <p style="color: #15803d; margin: 0; font-weight: 500;">A new user has joined the Candy Cane Kindness community!</p>
            </div>
          </div>

          <div style="background-color: #374151; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: white; margin: 0; font-size: 14px;">
              🎄 Candy Cane Kindness - Spreading joy one child at a time
            </p>
          </div>
        </div>
      `;
    } else if (type === 'auth_event') {
      emailSubject = `🔐 Authentication Event - ${emailRequest.eventType}`;
      emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🔐 Authentication Event</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Candy Cane Kindness Platform</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fecaca 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #f59e0b;">
              <h2 style="color: #92400e; margin: 0 0 20px 0; font-size: 22px;">🔐 Event Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 120px;">Event Type:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.eventType}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">User Email:</td><td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${emailRequest.userEmail}" style="color: #f59e0b; text-decoration: none;">${emailRequest.userEmail}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Timestamp:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.timestamp || new Date().toLocaleString()}</td></tr>
                ${emailRequest.ipAddress ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">IP Address:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.ipAddress}</td></tr>` : ''}
                ${emailRequest.userAgent ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">User Agent:</td><td style="padding: 8px 0; color: #1f2937; word-break: break-all;">${emailRequest.userAgent}</td></tr>` : ''}
              </table>
              
              ${emailRequest.eventDescription ? `
                <div style="margin-top: 20px;">
                  <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">📝 Description:</h3>
                  <p style="background-color: white; padding: 15px; border-radius: 8px; margin: 0; line-height: 1.6; color: #374151; border: 1px solid #e5e7eb;">${emailRequest.eventDescription}</p>
                </div>
              ` : ''}
            </div>

            <div style="background-color: #fef3c7; padding: 20px; border-radius: 12px; text-align: center; border: 2px dashed #f59e0b;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">⚠️ Security Notice</h3>
              <p style="color: #92400e; margin: 0; font-weight: 500;">Monitor for any suspicious authentication activity.</p>
            </div>
          </div>

          <div style="background-color: #374151; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: white; margin: 0; font-size: 14px;">
              🎄 Candy Cane Kindness - Spreading joy one child at a time
            </p>
          </div>
        </div>
      `;
    } else if (type === 'analytics_summary') {
      emailSubject = `📊 Weekly Analytics Summary - ${new Date().toLocaleDateString()}`;
      emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">📊 Analytics Summary</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Candy Cane Kindness Platform</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <div style="background: linear-gradient(135deg, #f3e8ff 0%, #dbeafe 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #8b5cf6;">
              <h2 style="color: #7c3aed; margin: 0 0 20px 0; font-size: 22px;">📈 Key Metrics</h2>
              <table style="width: 100%; border-collapse: collapse;">
                ${emailRequest.analyticsData?.pageViews ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 140px;">Page Views:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.analyticsData.pageViews}</td></tr>` : ''}
                ${emailRequest.analyticsData?.uniqueVisitors ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Unique Visitors:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.analyticsData.uniqueVisitors}</td></tr>` : ''}
                ${emailRequest.analyticsData?.newRegistrations ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">New Registrations:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.analyticsData.newRegistrations}</td></tr>` : ''}
                ${emailRequest.analyticsData?.adoptions ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Adoptions:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.analyticsData.adoptions}</td></tr>` : ''}
                ${emailRequest.analyticsData?.contactForms ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Contact Forms:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.analyticsData.contactForms}</td></tr>` : ''}
              </table>
              
              <div style="margin-top: 20px;">
                <h3 style="color: #7c3aed; margin: 0 0 10px 0; font-size: 16px;">📅 Report Period:</h3>
                <p style="background-color: white; padding: 15px; border-radius: 8px; margin: 0; line-height: 1.6; color: #374151; border: 1px solid #e5e7eb;">${emailRequest.analyticsData?.period || 'Last 7 days'}</p>
              </div>
            </div>

            <div style="background-color: #f3e8ff; padding: 20px; border-radius: 12px; text-align: center; border: 2px dashed #8b5cf6;">
              <h3 style="color: #7c3aed; margin: 0 0 10px 0; font-size: 18px;">📊 Insights</h3>
              <p style="color: #7c3aed; margin: 0; font-weight: 500;">Review the analytics data to optimize platform performance.</p>
            </div>
          </div>

          <div style="background-color: #374151; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: white; margin: 0; font-size: 14px;">
              🎄 Candy Cane Kindness - Spreading joy one child at a time
            </p>
          </div>
        </div>
      `;
    } else if (type === 'system_event') {
      emailSubject = `⚙️ System Event - ${emailRequest.systemEventType}`;
      emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #6b7280 0%, #374151 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">⚙️ System Event</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Candy Cane Kindness Platform</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #6b7280;">
              <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 22px;">⚙️ Event Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 120px;">Event Type:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.systemEventType}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Timestamp:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.timestamp || new Date().toLocaleString()}</td></tr>
              </table>
              
              ${emailRequest.eventDescription ? `
                <div style="margin-top: 20px;">
                  <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">📝 Description:</h3>
                  <p style="background-color: white; padding: 15px; border-radius: 8px; margin: 0; line-height: 1.6; color: #374151; border: 1px solid #e5e7eb;">${emailRequest.eventDescription}</p>
                </div>
              ` : ''}
              
              ${data ? `
                <div style="margin-top: 20px;">
                  <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">📊 Additional Data:</h3>
                  <pre style="background-color: white; padding: 15px; border-radius: 8px; margin: 0; overflow-x: auto; color: #374151; border: 1px solid #e5e7eb; font-size: 12px;">${JSON.stringify(data, null, 2)}</pre>
                </div>
              ` : ''}
            </div>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px; text-align: center; border: 2px dashed #6b7280;">
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 18px;">🔧 System Status</h3>
              <p style="color: #374151; margin: 0; font-weight: 500;">Monitor system health and performance.</p>
            </div>
          </div>

          <div style="background-color: #374151; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: white; margin: 0; font-size: 14px;">
              🎄 Candy Cane Kindness - Spreading joy one child at a time
            </p>
          </div>
        </div>
      `;
    } else if (type === 'admin_activity') {
      emailSubject = `🔑 Admin Activity - ${emailRequest.adminAction}`;
      emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #7c2d12 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🔑 Admin Activity</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Candy Cane Kindness Platform</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <div style="background: linear-gradient(135deg, #fecaca 0%, #fed7d7 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #dc2626;">
              <h2 style="color: #991b1b; margin: 0 0 20px 0; font-size: 22px;">🔑 Activity Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151; width: 120px;">Admin User:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.adminUser || 'Unknown'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Action:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.adminAction}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Timestamp:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.timestamp || new Date().toLocaleString()}</td></tr>
                ${emailRequest.ipAddress ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">IP Address:</td><td style="padding: 8px 0; color: #1f2937;">${emailRequest.ipAddress}</td></tr>` : ''}
              </table>
              
              ${emailRequest.eventDescription ? `
                <div style="margin-top: 20px;">
                  <h3 style="color: #991b1b; margin: 0 0 10px 0; font-size: 16px;">📝 Details:</h3>
                  <p style="background-color: white; padding: 15px; border-radius: 8px; margin: 0; line-height: 1.6; color: #374151; border: 1px solid #e5e7eb;">${emailRequest.eventDescription}</p>
                </div>
              ` : ''}
              
              ${data ? `
                <div style="margin-top: 20px;">
                  <h3 style="color: #991b1b; margin: 0 0 10px 0; font-size: 16px;">📊 Related Data:</h3>
                  <pre style="background-color: white; padding: 15px; border-radius: 8px; margin: 0; overflow-x: auto; color: #374151; border: 1px solid #e5e7eb; font-size: 12px;">${JSON.stringify(data, null, 2)}</pre>
                </div>
              ` : ''}
            </div>

            <div style="background-color: #fecaca; padding: 20px; border-radius: 12px; text-align: center; border: 2px dashed #dc2626;">
              <h3 style="color: #991b1b; margin: 0 0 10px 0; font-size: 18px;">🔐 Security Notice</h3>
              <p style="color: #991b1b; margin: 0; font-weight: 500;">Administrative actions are being monitored for security.</p>
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
