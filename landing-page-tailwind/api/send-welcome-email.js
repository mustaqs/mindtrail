// API endpoint for sending welcome emails
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://vwvolbwgkrswilswvdnj.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dm9sYndna3Jzd2lsc3d2ZG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDA1ODAsImV4cCI6MjA1ODU3NjU4MH0.fSNmIR4vcXIP3Z7c97HQrOyLmu5nhmYVQpNlwOmqe-4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend for email
const resendApiKey = process.env.RESEND_API_KEY || 're_QdhrAVfE_DXYtuS8vkhdwR865GuoQE2Tt';
const resend = new Resend(resendApiKey);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Generate a signed URL for the download
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from('downloads')
      .createSignedUrl('mindtrail-early-access.zip', 60 * 60 * 24); // 24hr expiry

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error('Error generating signed URL:', signedUrlError);
      throw new Error('Failed to generate download link');
    }

    // Send welcome email with early access instructions
    const { data, error } = await resend.emails.send({
      from: 'Mindtrail <info@mindtrail.xyz>',
      to: email,
      subject: 'Welcome to Mindtrail Early Access',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e1e1e; max-width: 600px; margin: auto; padding: 24px;">
          <h2 style="color: #333;">👋 Welcome to Mindtrail</h2>

          <p>Thanks for signing up for early access! We're excited to have you testing the very first version of <strong>Mindtrail</strong> — your thinking companion for the web.</p>

          <p>This early version lets you:</p>
          <ul>
            <li>💾 Save and organize selected browser tabs</li>
            <li>📝 Add notes and context to your sessions</li>
            <li>🔁 Revisit your research with clarity</li>
          </ul>

          <p><strong>🔓 Download your extension:</strong><br>
            <a href="${signedUrlData.signedUrl}" style="display: inline-block; margin: 12px 0; padding: 12px 20px; background-color: #3b82f6; color: #fff; text-decoration: none; border-radius: 6px;">Download Mindtrail</a>
          </p>

          <p><strong>🔑 Password to unzip:</strong> <code style="background: #f3f3f3; padding: 4px 8px; border-radius: 4px;">clickstorm</code></p>

          <p>🔧 <em>Installation instructions are included in the zip file.</em></p>

          <p>Once you're set up, we'd love your feedback!<br>
            👉 <a href="https://mindtrail.xyz/feedback">Leave feedback here</a>
          </p>

          <p style="margin-top: 32px;">Thanks again for testing Mindtrail early — you're helping shape the future of focused, clutter-free thinking online.</p>

          <p>— The Mindtrail Team</p>

          <hr style="margin: 32px 0;" />
          <small style="color: #888;">Sent from <a href="https://mindtrail.xyz" style="color: #888;">mindtrail.xyz</a> | info@mindtrail.xyz</small>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send welcome email' });
    }

    // Return success response
    return res.status(200).json({ 
      message: 'Welcome email sent successfully!',
      data
    });
  } catch (error) {
    console.error('Error processing email request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
