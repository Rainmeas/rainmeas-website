class CodeTerminal {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            typeSpeed: options.typeSpeed || 30,
            pauseDuration: options.pauseDuration || 800,
            lines: options.lines || [],
            lineClasses: options.lineClasses || [],
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.terminalCode = this.element.querySelector('.terminal-code');
        if (this.terminalCode) {
            this.animate();
        }
    }
    
    animate() {
        // Store the original content for graceful degradation
        const originalContent = this.terminalCode.innerHTML;
        
        // Clear the terminal initially to start with animation
        this.terminalCode.innerHTML = '';
        
        // Start the typing animation
        this.lineIndex = 0;
        this.charIndex = 0;
        this.typeLine();
    }
    
    typeLine() {
        if (this.lineIndex >= this.options.lines.length) {
            // Animation completed, show the final content
            this.terminalCode.innerHTML = this.terminalCode.dataset.original || this.terminalCode.innerHTML;
            return;
        }
        
        const currentLine = this.options.lines[this.lineIndex];
        
        if (this.charIndex <= currentLine.length) {
            // Build content up to current line
            let content = '';
            for (let i = 0; i < this.lineIndex; i++) {
                const lineClass = this.options.lineClasses[i];
                if (lineClass) {
                    content += `<span class="${lineClass}">${this.options.lines[i]}</span>`;
                } else {
                    content += this.options.lines[i];
                }
                content += '\n';
            }
            
            // Add current line being typed
            const currentClass = this.options.lineClasses[this.lineIndex];
            let currentLineContent = currentLine.substring(0, this.charIndex);
            if (currentClass && this.charIndex > 0) {
                currentLineContent = `<span class="${currentClass}">${currentLineContent}</span>`;
            }
            content += currentLineContent;
            
            // Update terminal content
            this.terminalCode.innerHTML = content;
            
            this.charIndex++;
            setTimeout(() => this.typeLine(), this.options.typeSpeed);
        } else {
            // Move to next line after a pause
            setTimeout(() => {
                this.lineIndex++;
                this.charIndex = 0;
                this.typeLine();
            }, this.options.pauseDuration);
        }
    }
    
    // Static method to initialize all terminals on the page
    static initAll() {
        const terminals = document.querySelectorAll('.terminal-code[data-terminal-lines]');
        terminals.forEach(terminal => {
            const container = terminal.closest('.terminal-window');
            if (container) {
                // Get lines from data attribute
                const lines = JSON.parse(terminal.dataset.terminalLines || '[]');
                const lineClasses = JSON.parse(terminal.dataset.lineClasses || '[]');
                
                // Store original content
                terminal.dataset.original = terminal.innerHTML;
                
                new CodeTerminal(container, {
                    lines: lines,
                    lineClasses: lineClasses
                });
            }
        });
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', CodeTerminal.initAll);
} else {
    CodeTerminal.initAll();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeTerminal;
}