import { Resend } from 'resend';
import { supabaseAdmin } from './supabase';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Use the same environment variables as in supabase.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

// Only log non-sensitive information
console.log('[INFO] Initializing Supabase and Resend clients');
const resendApiKey = process.env.RESEND_API_KEY || '';
console.log('[INFO] Resend API Key available:', !!resendApiKey);
export const resend = new Resend(resendApiKey);

// Email template for early access sign-ups
export const sendEarlyAccessEmail = async (email: string, directAdminClient?: SupabaseClient) => {
  console.log('[INFO] Starting email send process for:', email);
  
  try {
    // Use the provided direct admin client if available, otherwise fall back to the imported one
    const adminClient = directAdminClient || supabaseAdmin;
    
    // Check if any admin client is available (server-side only)
    if (!adminClient) {
      console.error('[ERROR] No Supabase admin client available. This should only be called server-side.');
      throw new Error('Supabase admin client is not available. This function should only be called server-side.');
    }
    
    // Check if the bucket exists first
    const { data: buckets, error: bucketError } = await adminClient
      .storage
      .listBuckets();
    
    console.log('[INFO] Checking for early-access bucket');
    
    if (bucketError) {
      console.error('[ERROR] Error listing buckets');
    }
    
    // Try to create the bucket if it doesn't exist
    const bucketExists = buckets?.some(b => b.name === 'early-access');
    
    if (!bucketExists) {
      console.log('[INFO] Bucket does not exist, attempting to create it');
      const { data: createData, error: createError } = await adminClient
        .storage
        .createBucket('early-access', {
          public: true
        });
      
      if (createError) {
        console.error('[ERROR] Error creating bucket');
      } else {
        console.log('[INFO] Successfully created bucket');
      }
    }
    
    // Check if the file exists in the bucket
    const { data: files, error: filesError } = await adminClient
      .storage
      .from('early-access')
      .list();
    
    console.log('[INFO] Checking for extension file in bucket');
    
    if (filesError) {
      console.error('[ERROR] Error listing files');
    }
    
    // Try to get the public URL first as it's more reliable
    console.log('[INFO] Trying to get public URL');
    const { data: publicUrlData } = await adminClient
      .storage
      .from('early-access')
      .getPublicUrl('mindtrail-early-access.zip');
    
    // Generate signed URL from Supabase with proper options
    console.log('[INFO] Generating signed URL from Supabase');
    const { data: signedUrlData, error } = await adminClient
      .storage
      .from('early-access')
      .createSignedUrl('mindtrail-early-access.zip', 60 * 60 * 24, {
        download: true, // Force download header
      });

    let downloadUrl;
    let usedFallback = false;
    
    if (error || !signedUrlData?.signedUrl) {
      console.error('[ERROR] Error generating signed URL');
      
      // Try to get a public URL as a second attempt before falling back
      if (publicUrlData?.publicUrl) {
        downloadUrl = publicUrlData.publicUrl;
        console.log('[INFO] Using public URL instead');
      } else {
        // Fall back to a static URL if Supabase fails
        downloadUrl = 'https://storage.googleapis.com/mindtrail-public/mindtrail-early-access.zip';
        usedFallback = true;
        console.log('[INFO] Using fallback URL');
      }
    } else {
      downloadUrl = signedUrlData.signedUrl;
      console.log('[INFO] Successfully generated download URL');
    }
    
    console.log('[INFO] Sending email with Resend');
    const data = await resend.emails.send({
      from: 'Mindtrail <info@mindtrail.xyz>',
      to: email,
      subject: 'Welcome to Mindtrail Early Access',
      html: getEmailTemplate(email, downloadUrl),
    });
    
    console.log('[INFO] Email sent successfully');
    return { success: true, data };
  } catch (error) {
    console.error('[ERROR] Error sending email:', error);
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
      
      <p>If you have any questions or feedback, please reply directly to this email. We're here to help!</p>
      
      <p style="margin-top: 32px;">Happy browsing,<br>The Mindtrail Team</p>
      
      <div style="margin-top: 48px; padding-top: 16px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
        <p>www.mindtrail.xyz | info@mindtrail.xyz</p>
        <p>This email was sent to ${email} because you signed up for early access to Mindtrail.</p>
      </div>
    </div>
  `;
}