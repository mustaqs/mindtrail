// Import Supabase client
import supabase from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Handle all Mindtrail download/try buttons
    const downloadButtons = [
        document.getElementById('download-extension'),
        document.getElementById('try-mindtrail-banner'),
        document.getElementById('try-mindtrail-features')
    ];
    
    // The actual download URL will be added later
    const extensionUrl = '#'; // Placeholder URL
    
    downloadButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // When the URL is provided, this will navigate to the Chrome Web Store
                // window.open(extensionUrl, '_blank');
                
                // For now, show a message that the link will be updated soon
                alert('The Mindtrail extension download link will be available soon!');
            });
        }
    });
    
    // Handle email form submission
    const emailForm = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('email-input');
    const submitButton = document.getElementById('submit-button');
    const formMessage = document.getElementById('form-message');
    
    // Function to handle form submission
    async function handleFormSubmission(e) {
        if (e) e.preventDefault();
        
        if (emailInput && emailInput.value) {
            const email = emailInput.value.trim();
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Disable the button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            
            try {
                console.log('Submitting email to Supabase:', email);
                
                // First, check if we can access the database at all
                const { data: healthCheck, error: healthError } = await supabase.from('waitlist').select('count').limit(1);
                console.log('Health check result:', healthCheck, healthError);
                
                if (healthError) {
                    console.error('Database connection error:', healthError);
                    throw new Error(`Cannot connect to database: ${healthError.message}`);
                }
                
                // Now try to insert the email
                const { data, error } = await supabase
                    .from('waitlist')
                    .insert({
                        email: email
                        // Let the database use default values for other fields
                    });
                
                // Log the complete response for debugging
                console.log('Complete Supabase response:', { data, error });
                
                // If there's no data returned, try to verify the insertion separately
                if (!error && (!data || data.length === 0)) {
                    const { data: verifyData, error: verifyError } = await supabase
                        .from('waitlist')
                        .select('email')
                        .eq('email', email)
                        .limit(1);
                        
                    console.log('Verification check:', { verifyData, verifyError });
                }
                
                if (error) {
                    // If it's a duplicate email error, show a friendly message
                    if (error.code === '23505') {
                        showMessage('You\'re already on the waitlist! We\'ll be in touch soon.', 'success');
                    } else {
                        console.error('Supabase error:', error);
                        throw new Error(error.message || 'Database error');
                    }
                } else {
                    showMessage('Thanks for joining our waitlist! We\'ll be in touch soon.', 'success');
                    emailInput.value = ''; // Clear the input
                }
            } catch (error) {
                console.error('Submission error:', error);
                showMessage(error.message || 'Something went wrong. Please try again later.', 'error');
            } finally {
                // Re-enable the button
                submitButton.disabled = false;
                submitButton.textContent = 'Get Early Access';
            }
        } else if (emailInput) {
            showMessage('Please enter your email address.', 'error');
        }
    }
    
    // Function to show messages to the user
    function showMessage(message, type) {
        if (!formMessage) return;
        
        // Set the message content and class
        formMessage.textContent = message;
        formMessage.className = 'form-message';
        formMessage.classList.add(`${type}-message`);
        formMessage.style.display = 'block';
        
        // Remove message after 5 seconds
        setTimeout(() => {
            formMessage.classList.add('fade-out');
            setTimeout(() => {
                formMessage.style.display = 'none';
                formMessage.classList.remove('fade-out');
            }, 500);
        }, 5000);
    }
    
    // Add event listener to the form
    if (emailForm) {
        emailForm.addEventListener('submit', handleFormSubmission);
    }

    // Add form submission event listener for the button click
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // If the button is inside the email form, let the form handler take care of it
            if (!button.closest('.email-form')) {
                // Smooth scroll to waitlist section
                const waitlistSection = document.querySelector('.waitlist');
                if (waitlistSection) {
                    e.preventDefault();
                    waitlistSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Scroll animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section-content, .feature-list li, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                if (!element.classList.contains('fade-in')) {
                    element.classList.add('fade-in');
                }
            }
        });
    };
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on page load
    animateOnScroll();
    
    // Banner button smooth scroll
    const bannerButton = document.querySelector('.banner-button');
    if (bannerButton) {
        bannerButton.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = bannerButton.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
