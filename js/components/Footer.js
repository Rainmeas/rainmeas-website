// Footer Component JavaScript
class Footer {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }

    render() {
        // Footer is already in HTML, but we could add dynamic functionality here if needed
        console.log('Footer component initialized');
    }
}

// Initialize the footer component
const footer = new Footer();

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Footer;
}