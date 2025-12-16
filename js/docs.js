// Documentation page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Animate sections on scroll
    const docSections = document.querySelectorAll('.docs-section');
    
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

    // Highlight current section in sidebar for single-page docs
    const docsSections = document.querySelectorAll('.docs-section');
    const allSections = [...docsSections];
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