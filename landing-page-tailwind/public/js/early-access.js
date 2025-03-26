// Early access form handling
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

// Initialize Supabase client
const supabaseUrl = 'https://vwvolbwgkrswilswvdnj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dm9sYndna3Jzd2lsc3d2ZG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDA1ODAsImV4cCI6MjA1ODU3NjU4MH0.fSNmIR4vcXIP3Z7c97HQrOyLmu5nhmYVQpNlwOmqe-4';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const earlyAccessForm = document.getElementById('early-access-form');
    const emailInput = document.getElementById('email');
    const submitButton = document.getElementById('submit-button');
    const formMessage = document.getElementById('form-message');
    
    // Add event listener to the form
    if (earlyAccessForm) {
        earlyAccessForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Function to handle form submission
    async function handleFormSubmission(e) {
        e.preventDefault();
        
        if (emailInput && emailInput.value) {
            const email = emailInput.value.trim();
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            try {
                // Show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="animate-pulse">Processing...</span>';
                
                // First, add the email to Supabase
                const { data, error } = await supabase
                    .from('waitlist')
                    .insert({
                        email: email,
                        source: 'tailwind_landing_page'
                    });
                
                // Log the complete response for debugging
                console.log('Supabase response:', { data, error });
                
                // Handle duplicate email error
                if (error && error.code === '23505') {
                    // Email already exists in the database
                    showMessage('You\'re already on our waitlist! We\'ll send you installation instructions shortly.', 'info');
                    emailInput.value = '';
                    submitButton.disabled = false;
                    submitButton.textContent = 'Get Early Access';
                    return;
                }
                
                // Handle other errors
                if (error) {
                    console.error('Error submitting to waitlist:', error);
                    showMessage('There was an error submitting your email. Please try again.', 'error');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Get Early Access';
                    return;
                }
                
                // Now send the welcome email
                try {
                    // Send email via fetch API
                    const response = await fetch('/api/send-welcome-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email }),
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to send welcome email');
                    }
                    
                    // Show success message and clear the form
                    showMessage('Thanks for signing up for early access! We\'ll send you installation instructions shortly.', 'success');
                    emailInput.value = '';
                    
                    // Hide the form and show a permanent success message
                    setTimeout(() => {
                        earlyAccessForm.innerHTML = `
                            <div class="text-center p-6 bg-gradient-to-br from-dark-surface/50 to-dark-surface/30 backdrop-blur-md rounded-lg border border-dark-border">
                                <div class="text-4xl mb-4">🎉</div>
                                <h3 class="text-xl font-bold text-white mb-2">You're in!</h3>
                                <p class="text-white/80">Check your inbox for installation instructions.</p>
                            </div>
                        `;
                    }, 3000);
                    
                } catch (emailError) {
                    console.error('Error sending welcome email:', emailError);
                    // Still show success since the email was added to the database
                    showMessage('Thanks for signing up! You\'ll receive an email with instructions soon.', 'success');
                    emailInput.value = '';
                }
                
            } catch (err) {
                console.error('Error:', err);
                showMessage('There was an error processing your request. Please try again.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Get Early Access';
            }
        }
    }
    
    // Function to show form messages
    function showMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.style.display = 'block';
            
            // Set message style based on type
            formMessage.className = 'mt-4 py-2 px-4 rounded-lg text-center';
            
            if (type === 'error') {
                formMessage.classList.add('bg-red-500/20', 'text-red-200', 'border', 'border-red-500/30');
            } else if (type === 'success') {
                formMessage.classList.add('bg-green-500/20', 'text-green-200', 'border', 'border-green-500/30');
            } else if (type === 'info') {
                formMessage.classList.add('bg-blue-500/20', 'text-blue-200', 'border', 'border-blue-500/30');
            }
            
            // Fade out message after 5 seconds for non-error messages
            if (type !== 'error') {
                setTimeout(() => {
                    formMessage.style.opacity = '0';
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                        formMessage.style.opacity = '1';
                    }, 500);
                }, 5000);
            }
        }
    }
});
