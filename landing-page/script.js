document.addEventListener('DOMContentLoaded', () => {
    // Handle email form submission
    const emailForm = document.querySelector('.email-form');
    
    if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = emailForm.querySelector('input[type="email"]');
            
            if (emailInput && emailInput.value) {
                // In a real implementation, this would send the email to your backend
                console.log('Email submitted:', emailInput.value);
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message fade-in';
                successMessage.textContent = 'Thanks for joining the waitlist! We\'ll be in touch soon.';
                
                emailForm.innerHTML = '';
                emailForm.appendChild(successMessage);
            }
        });
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
