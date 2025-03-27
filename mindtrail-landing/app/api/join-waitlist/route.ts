import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';
import { sendEarlyAccessEmail } from '../../../utils/resend';
import { createClient } from '@supabase/supabase-js';

// Create a direct Supabase admin client in the API route
// This ensures we have access to the environment variables in the server context
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabaseAdminDirect = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(request: Request) {
  console.log('[INFO] API route called: /api/join-waitlist');
  console.log('[INFO] Supabase URL available:', !!supabaseUrl);
  console.log('[INFO] Service key available:', !!supabaseServiceKey);
  
  try {
    // Parse the request body safely
    let email;
    try {
      const body = await request.json();
      email = body.email;
      console.log('[INFO] Received email submission');
    } catch (parseError) {
      console.error('[ERROR] Error parsing JSON request body');
      return NextResponse.json(
        { error: 'Invalid request format. Please provide a valid JSON body.' },
        { status: 400 }
      );
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('[WARN] Invalid email format submitted');
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Verify that supabaseAdminDirect is available
    if (!supabaseAdminDirect) {
      console.error('[ERROR] supabaseAdminDirect is not available in API route. Check environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error. Please try again later.' },
        { status: 500 }
      );
    }

    // Insert into Supabase
    console.log('[INFO] Inserting email into Supabase waitlist');
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ 
        email, 
        created_at: new Date().toISOString(),
        source: 'landing_page' 
      }])
      .select();

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        console.log('[INFO] Duplicate email detected, sending email again');
        // Even for duplicates, we can still send the email again
        try {
          console.log('[INFO] Sending email to existing user');
          // Pass the direct admin client to the email function
          const emailResult = await sendEarlyAccessEmail(email, supabaseAdminDirect);
          console.log('[INFO] Email sent to existing user:', emailResult.success);
          
          return NextResponse.json(
            { 
              message: 'You\'re already on the waitlist! We\'ve sent the access email again.',
              emailSent: emailResult.success
            },
            { status: 200 }
          );
        } catch (emailError) {
          console.error('[ERROR] Error sending email to existing user');
          return NextResponse.json(
            { 
              message: 'You\'re already on the waitlist! However, we couldn\'t send the email. Please try again later.',
              error: 'Email sending failed'
            },
            { status: 500 }
          );
        }
      }
      
      console.error('[ERROR] Error inserting email into Supabase');
      return NextResponse.json(
        { error: 'Failed to add you to the waitlist. Please try again later.' },
        { status: 500 }
      );
    }

    // Send email
    try {
      console.log('[INFO] Sending early access email');
      // Pass the direct admin client to the email function
      const emailResult = await sendEarlyAccessEmail(email, supabaseAdminDirect);
      console.log('[INFO] Email result:', emailResult.success);
      
      if (!emailResult.success) {
        console.error('[ERROR] Email sending failed');
        return NextResponse.json(
          { 
            message: 'You\'ve been added to the waitlist, but we couldn\'t send the welcome email. Please try again later.',
            error: 'Email sending failed'
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          message: 'You\'ve been added to the waitlist! Check your email for access details.',
          emailSent: true
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('[ERROR] Error sending email');
      return NextResponse.json(
        { 
          message: 'You\'ve been added to the waitlist, but we couldn\'t send the welcome email. Please try again later.',
          error: 'Email sending failed'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[ERROR] Unexpected error in join-waitlist API');
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
