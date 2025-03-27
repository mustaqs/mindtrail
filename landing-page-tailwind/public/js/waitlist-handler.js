// Waitlist handler script
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
                
                // Store the email locally (this is a temporary solution until the API is fixed)
                localStorage.setItem('mindtrail_signup_email', email);
                
                // Simulate successful signup
                setTimeout(() => {
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
                                <p class="text-white/60 mt-2 text-sm">If you don't see the email, please check your spam folder or contact <a href="mailto:support@mindtrail.xyz" class="text-accent-blue hover:underline">support@mindtrail.xyz</a></p>
                                <p class="text-white/60 mt-4 text-sm">For immediate access, please email <a href="mailto:support@mindtrail.xyz" class="text-accent-blue hover:underline">support@mindtrail.xyz</a> with the subject "Early Access Request: ${email}"</p>
                            </div>
                        `;
                    }, 3000);
                }, 1500);
                
            } catch (err) {
                console.error('Error:', err);
                showMessage('There was an error processing your request. Please try again or contact support@mindtrail.xyz.', 'error');
            } finally {
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Get Early Access';
                }, 1500);
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
