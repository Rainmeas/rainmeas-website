// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}));

// Liquid Text Animation for Feature Cards
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon i');
            icon.style.animation = 'liquidMove 1s ease infinite';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon i');
            icon.style.animation = '';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // Add ripple to button
            this.appendChild(ripple);
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add scroll animation to sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Terminal typing animation
document.addEventListener('DOMContentLoaded', function() {
    const terminalCode = document.querySelector('.terminal-code');
    if (terminalCode) {
        // Store the original content for graceful degradation
        const originalContent = terminalCode.innerHTML;
        
        // Clear the terminal initially to start with animation
        terminalCode.innerHTML = '';
        
        // Define the commands to type with timing
        const lines = [
            '$ rainmeas install nurashadeweather',
            'Installing nurashadeweather...',
            '✓ Successfully installed nurashadeweather@1.3.0',
            '$ rainmeas list',
            'nurashadeweather@1.3.0'
        ];
        
        // Define classes for each line (null means no special class)
        const lineClasses = [
            null,
            null,
            'success',
            null,
            'output'
        ];
        
        // Typing speed settings
        const typeSpeed = 30; // milliseconds per character
        
        // Start the typing animation
        let lineIndex = 0;
        let charIndex = 0;
        
        function typeLine() {
            if (lineIndex >= lines.length) {
                // Animation completed, show the final content
                terminalCode.innerHTML = originalContent;
                return;
            }
            
            const currentLine = lines[lineIndex];
            
            if (charIndex <= currentLine.length) {
                // Build content up to current line
                let content = '';
                for (let i = 0; i < lineIndex; i++) {
                    const lineClass = lineClasses[i];
                    if (lineClass) {
                        content += `<span class="${lineClass}">${lines[i]}</span>`;
                    } else {
                        content += lines[i];
                    }
                    content += '\n';
                }
                
                // Add current line being typed
                const currentClass = lineClasses[lineIndex];
                let currentLineContent = currentLine.substring(0, charIndex);
                if (currentClass && charIndex > 0) {
                    currentLineContent = `<span class="${currentClass}">${currentLineContent}</span>`;
                }
                content += currentLineContent;
                
                // Update terminal content
                terminalCode.innerHTML = content;
                
                charIndex++;
                setTimeout(typeLine, typeSpeed);
            } else {
                // Move to next line after a pause
                setTimeout(() => {
                    lineIndex++;
                    charIndex = 0;
                    typeLine();
                }, 800);
            }
        }
        
        // Start typing immediately
        typeLine();
    }
});