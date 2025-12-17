// Sidebar Component JavaScript
class Sidebar {
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
        // Set active link based on current page
        this.setActiveLink();
    }

    setActiveLink() {
        // Get current page path
        const currentPage = window.location.pathname.split('/').pop() || 'getting-started.html';
        
        // Remove active class from all links
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page link
        const activeLink = document.querySelector(`.sidebar-link[href="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Initialize the sidebar component
const sidebar = new Sidebar();

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sidebar;
}