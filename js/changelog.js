// Changelog page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Form submission for subscribe
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('.subscribe-input');
            const email = emailInput.value.trim();
            
            if (email) {
                // Simple email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(email)) {
                    // Show success message
                    const originalContent = this.innerHTML;
                    this.innerHTML = `
                        <div class="subscribe-success">
                            <i class="fas fa-check-circle"></i>
                            Thank you for subscribing! You'll receive updates about Rainmeas.
                        </div>
                    `;
                    
                    // Reset form after 3 seconds
                    setTimeout(() => {
                        this.innerHTML = originalContent;
                        emailInput.value = '';
                    }, 3000);
                } else {
                    // Show error for invalid email
                    showError(emailInput, 'Please enter a valid email address');
                }
            } else {
                // Show error for empty email
                showError(emailInput, 'Please enter your email address');
            }
        });
    }
    
    // Function to show error message
    function showError(input, message) {
        // Remove existing error
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        input.parentNode.insertBefore(error, input.nextSibling);
        
        // Add error class to input
        input.classList.add('error');
        
        // Remove error after 3 seconds
        setTimeout(() => {
            error.remove();
            input.classList.remove('error');
        }, 3000);
    }
    
    // Add animation to changelog items when they come into view
    const changelogVersions = document.querySelectorAll('.changelog-version');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    changelogVersions.forEach(version => {
        observer.observe(version);
    });
});