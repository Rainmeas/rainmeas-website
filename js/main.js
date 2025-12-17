/**
 * Rainmeas Website - Main JavaScript
 * 
 * Organized using a modular architecture for better maintainability and readability.
 * Uses modern ES6+ features and clear separation of concerns.
 */

/* =========================================
   1. CONFIGURATION & STATE
   ========================================= */
const CONFIG = {
    selectors: {
        header: {
            toggle: '.nav-toggle',
            menu: '.nav-menu',
            links: '.nav-link',
            menuIcon: '.menu-icon',
            closeIcon: '.close-icon'
        },
        packages: {
            grid: '#packages-grid',
            featuredGrid: '#featured-packages-grid',
            search: '#package-search',
            loadMore: '#load-more-btn',
            detailContainer: '.package-detail-container'
        },
        ui: {
            featureCards: '.feature-card',
            buttons: '.btn',
            sections: 'section, .cli-section, .docs-section, .changelog-version',
            codeBlocks: '.code-block',
            terminals: '.terminal-code'
        }
    },
    api: {
        registry: 'https://raw.githubusercontent.com/Rainmeas/rainmeas-registry/main/index.json',
        packageBase: 'https://raw.githubusercontent.com/Rainmeas/rainmeas-registry/main/packages/',
        githubApi: 'https://api.github.com/repos/'
    },
    pagination: {
        perPage: 6
    }
};

const STATE = {
    packages: {
        all: [],
        displayed: [],
        currentPage: 1
    }
};

/* =========================================
   2. DATA SERVICE (Registry & API)
   ========================================= */
const DataService = {
    /**
     * Fetch the registry index
     */
    async fetchRegistry() {
        try {
            const response = await fetch(CONFIG.api.registry);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.warn('Registry fetch failed, using local fallback:', error);
            return this.getLocalRegistry();
        }
    },

    /**
     * Fetch details for a specific package
     */
    async fetchPackageDetails(name) {
        try {
            const response = await fetch(`${CONFIG.api.packageBase}${name}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            // Enrich with GitHub data (downloads)
            const downloads = await this.fetchGithubDownloads(data.homepage);
            if (downloads !== null) data.downloadCount = downloads;
            
            return data;
        } catch (error) {
            console.warn(`Package details fetch failed for ${name}:`, error);
            return this.getLocalPackage(name);
        }
    },

    /**
     * Fetch all packages
     */
    async fetchAllPackages() {
        try {
            const registry = await this.fetchRegistry();
            const names = Object.keys(registry);
            return await Promise.all(names.map(name => this.fetchPackageDetails(name)));
        } catch (error) {
            console.error('Error fetching all packages:', error);
            return this.getLocalAllPackages();
        }
    },

    /**
     * Fetch download counts from GitHub API
     */
    async fetchGithubDownloads(homepageUrl) {
        if (!homepageUrl) return null;
        
        try {
            // Extract owner/repo from URL
            const match = homepageUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (!match) return null;

            const [_, owner, repo] = match;
            const response = await fetch(`${CONFIG.api.githubApi}${owner}/${repo}/releases`);
            
            if (!response.ok) return null;
            
            const releases = await response.json();
            
            // Sum asset download counts
            return releases.reduce((total, release) => {
                const assetDownloads = (release.assets || []).reduce((acc, asset) => acc + (asset.download_count || 0), 0);
                return total + assetDownloads;
            }, 0);
        } catch (error) {
            console.error('GitHub API error:', error);
            return null;
        }
    },

    // --- Fallback Data ---
    getLocalRegistry() {
        return {
            "nurashade-reversegeo": { "latest": "1.0.0" },
            "nurashadeweather": { "latest": "1.0.0" }
        };
    },

    getLocalPackage(name) {
        const db = {
            "nurashade-reversegeo": {
                name: "nurashade-reversegeo",
                author: "nurashade",
                description: "NuraShade Reverse Geo is a Rainmeter configuration component that provides reverse geocoding capabilities using the BigDataCloud API.",
                homepage: "https://github.com/NuraShade/NuraShadeReverseGeo",
                license: "Creative Commons Attribution-ShareAlike 3.0 Unported",
                versions: { latest: "1.0.0" },
                icon: "fas fa-map-marker-alt"
            },
            "nurashadeweather": {
                name: "nurashadeweather",
                author: "nurashade",
                description: "NuraShade Weather Measures is a collection of Rainmeter configuration files that provide comprehensive weather forecasting capabilities.",
                homepage: "https://github.com/NuraShade/NuraShadeWeather",
                license: "Creative Commons Attribution-ShareAlike 3.0 Unported",
                versions: { latest: "1.0.0" },
                icon: "fas fa-cloud-sun"
            }
        };
        return db[name] || null;
    },

    getLocalAllPackages() {
        return ["nurashade-reversegeo", "nurashadeweather"]
            .map(name => this.getLocalPackage(name))
            .filter(Boolean);
    }
};

/* =========================================
   3. UI & ANIMATION MODULES
   ========================================= */
const UI = {
    /**
     * Initialize all scroll-based animations
     */
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible', 'animated');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll(CONFIG.selectors.ui.sections).forEach(el => observer.observe(el));
    },

    /**
     * Initialize specific UI effects (Liquid text, Ripple)
     */
    initEffects() {
        // Feature Cards Liquid Effect
        document.querySelectorAll(CONFIG.selectors.ui.featureCards).forEach(card => {
            const icon = card.querySelector('.feature-icon i');
            if (!icon) return;
            
            card.addEventListener('mouseenter', () => icon.style.animation = 'liquidMove 1s ease infinite');
            card.addEventListener('mouseleave', () => icon.style.animation = '');
        });

        // Button Ripple Effect
        document.querySelectorAll(CONFIG.selectors.ui.buttons).forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
};

/* =========================================
   4. NAVIGATION MODULE
   ========================================= */
const Navigation = {
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.setActiveLink();
    },

    cacheDOM() {
        this.toggle = document.querySelector(CONFIG.selectors.header.toggle);
        this.menu = document.querySelector(CONFIG.selectors.header.menu);
        this.menuIcon = document.querySelector(CONFIG.selectors.header.menuIcon);
        this.closeIcon = document.querySelector(CONFIG.selectors.header.closeIcon);
    },

    bindEvents() {
        if (!this.toggle || !this.menu) return;

        // Toggle click
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close on link click
        document.querySelectorAll(CONFIG.selectors.header.links).forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Keyboard Escape
        this.menu.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
                this.toggle.focus();
            }
        });
    },

    toggleMenu() {
        const isActive = this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
        this.toggle.setAttribute('aria-expanded', isActive);
        
        this.updateIcons(isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    },

    closeMenu() {
        if (!this.menu.classList.contains('active')) return;
        
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
        
        this.updateIcons(false);
        document.body.style.overflow = '';
    },

    updateIcons(isActive) {
        if (this.menuIcon && this.closeIcon) {
            this.menuIcon.style.display = isActive ? 'none' : 'block';
            this.closeIcon.style.display = isActive ? 'block' : 'none';
        }
    },

    setActiveLink() {
        const currentPath = window.location.pathname;
        const filename = currentPath.split('/').pop() || 'index.html';
        
        // Clear active
        document.querySelectorAll(CONFIG.selectors.header.links).forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

        // Header Logic
        let selector = `.nav-link[href*="${filename}"]`;
        
        // Handle Documentation specially
        if (currentPath.includes('/docs/') || currentPath.includes('/documentation')) {
            selector = '.nav-link[href*="documentation"]';
        } else if (filename === 'index.html' || filename === '') {
            selector = '.nav-link[href="index.html"], .nav-link[href="/"]';
        }

        const activeNav = document.querySelector(selector);
        if (activeNav) activeNav.classList.add('active');

        // Sidebar logic
        const sidebarLink = document.querySelector(`.sidebar-link[href="${filename}"]`);
        if (sidebarLink) sidebarLink.classList.add('active');
    }
};

/* =========================================
   5. COMPONENT MODULES
   ========================================= */
const Components = {
    init() {
        this.initCodeBlocks();
        this.initTerminals();
    },

    // --- Code Blocks (Copy Logic) ---
    initCodeBlocks() {
        document.querySelectorAll(CONFIG.selectors.ui.codeBlocks).forEach(block => {
            const btn = block.querySelector('.copy-btn');
            if (btn) this.bindCopyButton(btn, block);
        });
        
        // Also bind standalone copy buttons (e.g. in install cards)
        document.querySelectorAll('.copy-btn:not(.code-block .copy-btn)').forEach(btn => {
            this.bindCopyButton(btn, null);
        });
    },

    bindCopyButton(btn, container) {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const text = this.getCopyTarget(btn, container);
            
            if (text) {
                try {
                    await navigator.clipboard.writeText(text);
                    this.showCopyFeedback(btn);
                } catch (err) {
                    console.error('Copy failed:', err);
                }
            }
        });
    },

    getCopyTarget(btn, container) {
        // Priority 1: Data attribute on button
        if (btn.hasAttribute('data-copy')) return btn.getAttribute('data-copy');
        
        // Priority 2: Target ID
        if (btn.hasAttribute('data-command-target')) {
            const target = document.getElementById(btn.getAttribute('data-command-target'));
            return target ? target.textContent : null;
        }

        // Priority 3: Container context
        if (container) {
            const code = container.querySelector('code, pre') || container.previousElementSibling;
            return code ? code.textContent : null;
        }
        return null;
    },

    showCopyFeedback(btn) {
        const original = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '<span class="copy-btn-icon checkmark-icon"></span>';
        
        setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.remove('copied');
        }, 2000);
    },

    // --- Terminal Animation ---
    initTerminals() {
        document.querySelectorAll(CONFIG.selectors.ui.terminals).forEach(terminal => {
            if (!terminal.dataset.terminalLines) return;
            
            const lines = JSON.parse(terminal.dataset.terminalLines);
            const classes = JSON.parse(terminal.dataset.lineClasses || '[]');
            terminal.dataset.original = terminal.innerHTML; // Backup
            
            this.runTerminalAnimation(terminal, lines, classes);
        });
    },

    runTerminalAnimation(el, lines, classes) {
        el.innerHTML = ''; // Reset
        let lineIdx = 0;
        let charIdx = 0;
        
        const type = () => {
            if (lineIdx >= lines.length) {
                // Restore completed state to prevent layout shifts or empty states if re-triggered
                el.innerHTML = el.dataset.original; 
                return;
            }

            const currentLine = lines[lineIdx];
            const currentClass = classes[lineIdx];

            // Construct previous lines
            let html = lines.slice(0, lineIdx).map((l, i) => 
                classes[i] ? `<span class="${classes[i]}">${l}</span>` : l
            ).join('\n') + '\n';

            // Construct current typing line
            let typed = currentLine.substring(0, charIdx);
            if (currentClass) typed = `<span class="${currentClass}">${typed}</span>`;
            
            el.innerHTML = html + typed;

            if (charIdx < currentLine.length) {
                charIdx++;
                setTimeout(type, 30);
            } else {
                charIdx = 0;
                lineIdx++;
                setTimeout(type, 800);
            }
        };

        type();
    }
};

/* =========================================
   6. PAGE SPECIFIC LOGIC
   ========================================= */
const Pages = {
    init() {
        // Check which page we are on and init relevant logic
        if (document.getElementById('packages-grid')) this.Packages.init();
        if (document.getElementById('package-readme')) this.PackageDetail.init();
    },

    // --- Packages List Page ---
    Packages: {
        init() {
            this.grid = document.querySelector(CONFIG.selectors.packages.grid);
            this.featured = document.querySelector(CONFIG.selectors.packages.featuredGrid);
            this.search = document.querySelector(CONFIG.selectors.packages.search);
            this.loadMoreBtn = document.querySelector(CONFIG.selectors.packages.loadMore);
            
            // Event Listeners
            if (this.search) {
                this.search.addEventListener('input', (e) => this.filter(e.target.value));
            }
            if (this.loadMoreBtn) {
                this.loadMoreBtn.addEventListener('click', () => this.loadMore());
            }
            
            // Clicks on "View Details"
            const gridHandler = (e) => {
                const btn = e.target.closest('.btn-secondary');
                if (btn) {
                   const card = btn.closest('.package-card');
                   const name = card.querySelector('.package-name').textContent;
                   window.location.href = `package/detail.html?name=${encodeURIComponent(name)}`;
                }
            };
            if (this.grid) this.grid.addEventListener('click', gridHandler);
            if (this.featured) this.featured.addEventListener('click', gridHandler);

            // Initial Load
            this.load();
        },

        async load() {
            const packages = await DataService.fetchAllPackages();
            STATE.packages.all = packages;
            STATE.packages.displayed = [...packages];
            
            this.render(STATE.packages.displayed.slice(0, CONFIG.pagination.perPage));
            this.renderFeatured(packages);
            this.updateLoadMore(CONFIG.pagination.perPage);
        },

        render(items, append = false) {
            if (!this.grid) return;
            
            if (!items.length) {
                this.grid.innerHTML = '<div class="no-packages-message">No packages found.</div>';
                return;
            }

            const html = items.map(pkg => this.createCardHtml(pkg)).join('');
            
            if (append) {
                this.grid.innerHTML += html;
            } else {
                this.grid.innerHTML = html;
            }
        },

        renderFeatured(packages) {
            if (!this.featured || !packages.length) return;
            // Feature the first package or filter by some criteria
            const featuredPkg = packages[0]; 
            
            this.featured.innerHTML = this.createCardHtml(featuredPkg, true);
        },

        createCardHtml(pkg, isFeatured = false) {
            const classes = isFeatured ? 'package-card featured' : 'package-card';
            const badge = isFeatured ? '<div class="package-badge">Featured</div>' : '';
            const icon = pkg.icon ? `<div class="package-icon"><i class="${pkg.icon}"></i></div>` : '';
            const downloads = pkg.downloadCount 
                ? `<span class="package-downloads"><i class="fas fa-download"></i> ${pkg.downloadCount}</span>` 
                : '';

            return `
                <div class="${classes}" data-package-name="${pkg.name}">
                    ${badge}
                    <div class="package-header">
                        ${icon}
                        <div class="package-info">
                            <h3 class="package-name">${pkg.name}</h3>
                            <p class="package-author">by ${pkg.author}</p>
                        </div>
                    </div>
                    <p class="package-description">${pkg.description}</p>
                    <div class="package-meta">
                        <span class="package-version">v${pkg.versions.latest}</span>
                        ${downloads}
                    </div>
                    <div class="package-actions">
                        <button class="btn btn-secondary">View Details</button>
                    </div>
                </div>
            `;
        },

        filter(term) {
            const lowerTerm = term.toLowerCase();
            STATE.packages.displayed = STATE.packages.all.filter(p => 
                p.name.toLowerCase().includes(lowerTerm) ||
                p.author.toLowerCase().includes(lowerTerm) ||
                p.description.toLowerCase().includes(lowerTerm)
            );
            
            STATE.packages.currentPage = 1;
            this.render(STATE.packages.displayed.slice(0, CONFIG.pagination.perPage));
            this.updateLoadMore(CONFIG.pagination.perPage);
        },

        loadMore() {
            STATE.packages.currentPage++;
            const start = (STATE.packages.currentPage - 1) * CONFIG.pagination.perPage;
            const end = start + CONFIG.pagination.perPage;
            
            const nextBatch = STATE.packages.displayed.slice(start, end);
            this.render(nextBatch, true);
            this.updateLoadMore(end);
        },

        updateLoadMore(shownCount) {
            if (!this.loadMoreBtn) return;
            this.loadMoreBtn.style.display = shownCount >= STATE.packages.displayed.length ? 'none' : 'block';
        }
    },

    // --- Package Details Page ---
    PackageDetail: {
        async init() {
            const params = new URLSearchParams(window.location.search);
            const name = params.get('name');

            if (!name) {
                this.showError('No package specified.');
                return;
            }

            const pkg = await DataService.fetchPackageDetails(name);
            if (!pkg) {
                this.showError('Package not found.');
                return;
            }

            this.render(pkg);
        },

        render(pkg) {
            // Title & SEO
            document.title = `${pkg.name} - Rainmeas`;
            this.setText('package-name-breadcrumb', pkg.name);
            this.setText('package-title', pkg.name);
            this.setText('package-author', `by ${pkg.author}`);
            this.setText('package-version', `v${pkg.versions.latest}`);
            this.setText('package-license', pkg.license || 'Not specified');
            this.setText('install-command', `rainmeas install ${pkg.name}`);

            // Versions
            const otherVersions = Object.keys(pkg.versions).filter(v => v !== 'latest').join(', ');
            this.setText('package-versions', otherVersions || 'None');

            // GitHub Link
            const gitLink = document.getElementById('github-link');
            if (gitLink) {
                if (pkg.homepage) gitLink.href = pkg.homepage;
                else gitLink.style.display = 'none';
            }

            // Downloads injection
            if (pkg.downloadCount) {
                this.injectDownloadCount(pkg.downloadCount);
            }

            // Markdown Content
            this.renderReadme(pkg);
        },

        async renderReadme(pkg) {
            const container = document.getElementById('package-readme');
            if (!container) return;

            if (pkg.markdown) {
                try {
                    const res = await fetch(pkg.markdown);
                    if (!res.ok) throw new Error('Failed to load markdown');
                    const text = await res.text();
                    
                    if (typeof marked !== 'undefined') {
                        container.innerHTML = marked.parse(text);
                    } else {
                        container.textContent = text;
                    }
                } catch (e) {
                    container.innerHTML = `<p>Error loading documentation. View on <a href="${pkg.homepage}">GitHub</a>.</p>`;
                }
            } else {
                container.innerHTML = `<p>${pkg.description}</p>`;
            }
        },

        injectDownloadCount(count) {
            const card = document.querySelector('.package-detail-card');
            if (!card) return;
            
            // Insert before the last item (usually versions or license)
            const div = document.createElement('div');
            div.className = 'package-detail-item';
            div.innerHTML = `
                <div class="package-detail-label">Downloads</div>
                <div class="package-detail-value"><i class="fas fa-download"></i> ${count}</div>
            `;
            
            const last = card.querySelector('.package-detail-item:last-child');
            if (last) last.parentNode.insertBefore(div, last);
        },

        setText(id, text) {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        },

        showError(msg) {
            const el = document.getElementById('package-readme');
            if (el) el.innerHTML = `<div class="error-message">${msg}</div>`;
        }
    }
};

/* =========================================
   7. INITIALIZATION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Core UI logic
    Navigation.init();
    UI.initScrollAnimations();
    UI.initEffects();
    
    // 2. Components
    Components.init();

    // 3. Page Logic
    Pages.init();
    
    console.log('Rainmeas App Initialized');
});

// Configure Marked.js if present
if (typeof marked !== 'undefined') {
    marked.setOptions({
        gfm: true,
        breaks: true,
        smartLists: true,
        smartypants: true
    });
}