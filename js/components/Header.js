// New Header Component JavaScript
class HeaderNew {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            // Toggle mobile menu
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu(navMenu, navToggle);
            });
            
            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMenu(navMenu, navToggle);
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (event) => {
                const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
                
                if (!isClickInsideNav) {
                    this.closeMenu(navMenu, navToggle);
                }
            });

            // Handle keyboard navigation
            this.setupKeyboardNavigation(navMenu);
        }

        // Set active link based on current page
        this.setActiveLink();
    }

    toggleMenu(navMenu, navToggle) {
        const isActive = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isActive);
        
        // Toggle icons
        const menuIcon = navToggle.querySelector('.menu-icon');
        const closeIcon = navToggle.querySelector('.close-icon');
        
        if (menuIcon && closeIcon) {
            if (isActive) {
                menuIcon.style.display = 'none';
                closeIcon.style.display = 'block';
            } else {
                menuIcon.style.display = 'block';
                closeIcon.style.display = 'none';
            }
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    closeMenu(navMenu, navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        
        // Toggle icons back to menu icon
        const menuIcon = navToggle.querySelector('.menu-icon');
        const closeIcon = navToggle.querySelector('.close-icon');
        
        if (menuIcon && closeIcon) {
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
        
        // Re-enable body scroll
        document.body.style.overflow = '';
    }

    setupKeyboardNavigation(navMenu) {
        const menuLinks = navMenu.querySelectorAll('.nav-link');
        if (menuLinks.length === 0) return;

        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu(navMenu, document.querySelector('.nav-toggle'));
                document.querySelector('.nav-toggle').focus();
            }
        });

        menuLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % menuLinks.length;
                    menuLinks[nextIndex].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + menuLinks.length) % menuLinks.length;
                    menuLinks[prevIndex].focus();
                }
            });
        });
    }

    setActiveLink() {
        // Get current page path
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const fullPath = window.location.pathname;
            
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
            
        // Check if we're on a documentation page
        if (fullPath.includes('/docs/') || fullPath.includes('/documentation')) {
            // Activate the Documentation link for all documentation pages
            const docLink = document.querySelector('.nav-link[href*="documentation"]');
            if (docLink) {
                docLink.classList.add('active');
                return;
            }
        }
            
        // Add active class to current page link
        const activeLink = document.querySelector(`.nav-link[href*="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        } else {
            // Fallback for home page
            if (currentPage === 'index.html' || currentPage === '') {
                const homeLink = document.querySelector('.nav-link[href="index.html"], .nav-link[href="/" ]');
                if (homeLink) {
                    homeLink.classList.add('active');
                }
            }
        }
    }
}

// Initialize the header component
const headerNew = new HeaderNew();

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderNew;
}