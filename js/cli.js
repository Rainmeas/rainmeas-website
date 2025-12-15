// CLI page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Account for fixed navbar height
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                
                // Get the position of the target element relative to the document
                const rect = targetElement.getBoundingClientRect();
                const targetPosition = rect.top + window.pageYOffset - navbarHeight - 20; // Extra 20px spacing
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
                
                // Manually trigger scroll event to update sidebar positioning after a small delay
                setTimeout(() => {
                    window.dispatchEvent(new Event('scroll'));
                }, 100);
            }
        });
    });
    
    // Animate sections on scroll
    const cliSections = document.querySelectorAll('.cli-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    cliSections.forEach(section => {
        observer.observe(section);
    });
    
    // Copy to clipboard functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const code = this.previousElementSibling.textContent;
            navigator.clipboard.writeText(code).then(() => {
                // Show feedback
                this.classList.add('copied');
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    this.innerHTML = originalIcon;
                    this.classList.remove('copied');
                }, 2000);
            });
        });
    });
    
    // Highlight current section in sidebar
    const sections = document.querySelectorAll('.cli-section');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        // Get navbar height for scroll position calculation
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.pageYOffset + navbarHeight + 20; // Account for navbar height and spacing
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});