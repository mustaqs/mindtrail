import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Use the same environment variables as in supabase.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Resend with better logging
const resendApiKey = process.env.RESEND_API_KEY || '';
console.log('Resend API Key available:', !!resendApiKey);
export const resend = new Resend(resendApiKey);

// Email template for early access sign-ups
export const sendEarlyAccessEmail = async (email: string) => {
  console.log('Starting email send process for:', email);
  
  try {
    // Generate signed URL from Supabase
    console.log('Generating signed URL from Supabase...');
    const { data: signedUrlData, error } = await supabase
    .storage
    .from('downloads')
    .createSignedUrl('mindtrail-early-access.zip', 60 * 60 * 24);

    if (error || !signedUrlData?.signedUrl) {
      console.error('Error generating signed URL:', error);
      // Fall back to a static URL if Supabase fails
      const fallbackUrl = 'https://storage.googleapis.com/mindtrail-public/mindtrail-early-access.zip';
      console.log('Using fallback URL:', fallbackUrl);
      
      // Continue with the fallback URL instead of throwing an error
      const downloadUrl = fallbackUrl;
      
      console.log('Sending email with fallback download URL...');
      const data = await resend.emails.send({
        from: 'Mindtrail <info@mindtrail.xyz>',
        to: email,
        subject: 'Welcome to Mindtrail Early Access',
        html: getEmailTemplate(email, downloadUrl),
      });
      
      console.log('Email sent with fallback URL, response:', data);
      return { success: true, data };
    }

    const downloadUrl = signedUrlData.signedUrl;
    console.log('Successfully generated download URL:', downloadUrl);
    
    console.log('Sending email with Resend...');
    const data = await resend.emails.send({
      from: 'Mindtrail <info@mindtrail.xyz>',
      to: email,
      subject: 'Welcome to Mindtrail Early Access',
      html: getEmailTemplate(email, downloadUrl),
    });
    
    console.log('Email sent successfully, response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// Separate function for the email template to keep the code cleaner
function getEmailTemplate(email: string, downloadUrl: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h1 style="color: #3b82f6; margin-bottom: 24px;">Welcome to Mindtrail Early Access!</h1>
      
      <p>Thank you for signing up for early access to Mindtrail - Your Thinking Companion for the Web.</p>
      
      <p>We're excited to have you join our community of early users who are looking for a better way to organize their browser tabs and boost productivity.</p>
      
      <h2 style="color: #3b82f6; margin-top: 32px; margin-bottom: 16px;">Getting Started</h2>
      
      <p>To get started with Mindtrail:</p>
      
      <ol style="margin-bottom: 24px;">
        <li>Download the Chrome extension <a href="${downloadUrl}" style="color: #3b82f6; text-decoration: underline;">here</a></li>
        <li>Unzip the file on your computer</li>
        <li>Open Chrome and go to chrome://extensions/</li>
        <li>Enable "Developer mode" in the top-right corner</li>
        <li>Click "Load unpacked" and select the unzipped folder</li>
        <li>The Mindtrail icon will appear in your browser toolbar</li>
      </ol>
      
      <p style="margin-top: 32px;"><strong>Password:</strong> <code>clickstorm</code></p>
      
      <p>If you have any questions or feedback, please reply directly to this email. We're here to help!</p>
      
      <p style="margin-top: 32px;">Happy browsing,<br>The Mindtrail Team</p>
      
      <div style="margin-top: 48px; padding-top: 16px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
        <p>www.mindtrail.xyz | info@mindtrail.xyz</p>
        <p>This email was sent to ${email} because you signed up for early access to Mindtrail.</p>
      </div>
    </div>
  `;
}
