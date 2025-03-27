import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';
import { sendEarlyAccessEmail } from '../../../utils/resend';

export async function POST(request: Request) {
  console.log('API route called: /api/join-waitlist');
  
  try {
    // Parse the request body safely
    let email;
    try {
      const body = await request.json();
      email = body.email;
      console.log('Received email submission for:', email);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format. Please provide a valid JSON body.' },
        { status: 400 }
      );
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    console.log('Inserting email into Supabase waitlist:', email);
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
        console.log('Duplicate email detected:', email);
        // Even for duplicates, we can still send the email again
        try {
          console.log('Sending email to existing user...');
          const emailResult = await sendEarlyAccessEmail(email);
          console.log('Email result for existing user:', emailResult);
          
          return NextResponse.json(
            { 
              message: 'You\'re already on the waitlist! We\'ve sent the access email again.',
              emailSent: emailResult.success
            },
            { status: 200 }
          );
        } catch (emailError) {
          console.error('Error sending email to existing user:', emailError);
          return NextResponse.json(
            { 
              message: 'You\'re already on the waitlist! We encountered an issue sending the email again.',
              emailSent: false
            },
            { status: 200 }
          );
        }
      }
      
      console.error('Error inserting into Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again later.' },
        { status: 500 }
      );
    }

    // Send welcome email with download link
    console.log('Successfully added to waitlist, sending welcome email...');
    try {
      const emailResult = await sendEarlyAccessEmail(email);
      console.log('Email send result:', emailResult);

      return NextResponse.json(
        { 
          message: 'Thanks for signing up for early access! Check your email for access instructions.',
          data,
          emailSent: emailResult.success
        },
        { status: 201 }
      );
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      return NextResponse.json(
        { 
          message: 'Successfully joined the waitlist! We encountered an issue sending the welcome email.',
          data,
          emailSent: false
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
