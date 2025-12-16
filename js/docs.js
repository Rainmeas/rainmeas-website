// Documentation page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Animate sections on scroll
    const docSections = document.querySelectorAll('.docs-section');
    const cliSectionsList = document.querySelectorAll('.cli-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    docSections.forEach(section => {
        observer.observe(section);
    });
    
    cliSectionsList.forEach(section => {
        observer.observe(section);
    });
    
    // Copy to clipboard functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const code = this.getAttribute('data-copy');
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
    
    // Highlight current section in sidebar for single-page docs
    const docsSections = document.querySelectorAll('.docs-section');
    const cliSections = document.querySelectorAll('.cli-section');
    const allSections = [...docsSections, ...cliSections];
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    if (allSections.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            
            // Get navbar height for scroll position calculation
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            
            allSections.forEach(section => {
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
    }
});