/**
 * CodeBlock Component
 * A reusable component for displaying code blocks with copy functionality
 */

class CodeBlock {
    /**
     * Initialize a new CodeBlock instance
     * @param {HTMLElement} element - The container element for the code block
     * @param {Object} options - Configuration options
     */
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            copyButtonClass: 'copy-btn',
            copiedClass: 'copied',
            copyDelay: 2000,
            ...options
        };
        
        this.init();
    }
    
    /**
     * Initialize the component
     */
    init() {
        this.copyButton = this.element.querySelector(`.${this.options.copyButtonClass}`);
        if (this.copyButton) {
            this.bindEvents();
        }
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        this.copyButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.copyToClipboard();
        });
    }
    
    /**
     * Copy code content to clipboard
     */
    copyToClipboard() {
        // Get the code content to copy
        let codeToCopy = '';
        
        // Check for data-copy attribute first
        if (this.copyButton.hasAttribute('data-copy')) {
            codeToCopy = this.copyButton.getAttribute('data-copy');
        } 
        // Check for data-command-target attribute (used in package detail)
        else if (this.copyButton.hasAttribute('data-command-target')) {
            const targetId = this.copyButton.getAttribute('data-command-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                codeToCopy = targetElement.textContent;
            }
        }
        // Fallback: get text content from adjacent code element
        else {
            const codeElement = this.element.querySelector('code') || 
                              this.element.querySelector('pre') ||
                              this.element.previousElementSibling;
            if (codeElement) {
                codeToCopy = codeElement.textContent;
            }
        }
        
        // Copy to clipboard
        if (codeToCopy) {
            navigator.clipboard.writeText(codeToCopy).then(() => {
                this.showCopyFeedback();
            }).catch(err => {
                console.error('Failed to copy code: ', err);
            });
        }
    }
    
    /**
     * Show visual feedback when code is copied
     */
    showCopyFeedback() {
        const originalContent = this.copyButton.innerHTML;
        
        // Add copied class for styling
        this.copyButton.classList.add(this.options.copiedClass);
        
        // Change button content to checkmark
        this.copyButton.innerHTML = '<span class="copy-btn-icon checkmark-icon"></span>';
        
        // Reset after delay
        setTimeout(() => {
            this.copyButton.innerHTML = originalContent;
            this.copyButton.classList.remove(this.options.copiedClass);
        }, this.options.copyDelay);
    }
    
    /**
     * Static method to initialize all code blocks on the page
     */
    static initAll() {
        // Initialize code blocks with copy buttons
        const codeBlocks = document.querySelectorAll('.code-block');
        codeBlocks.forEach(block => {
            new CodeBlock(block);
        });
        

    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', CodeBlock.initAll);
} else {
    CodeBlock.initAll();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeBlock;
}