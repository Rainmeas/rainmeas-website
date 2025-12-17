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
            
            // Position ripple at click location
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
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


document.addEventListener("DOMContentLoaded", function () {
  // Add animation to changelog items when they come into view
  const changelogVersions = document.querySelectorAll(".changelog-version");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  changelogVersions.forEach((version) => {
    observer.observe(version);
  });
});

// CLI Commands page functionality
document.addEventListener('DOMContentLoaded', function() {
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
});

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
});

// Registry Functions
// Function to fetch registry index from GitHub
async function fetchRegistryIndex() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Rainmeas/rainmeas-registry/main/index.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching registry index:', error);
        // Fallback to local data if GitHub fetch fails
        return getLocalRegistryData();
    }
}

// Function to fetch package details from GitHub
async function fetchPackageDetails(packageName) {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/Rainmeas/rainmeas-registry/main/packages/${packageName}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Add download count from GitHub API
        const downloadCount = await getGitHubDownloadCount(data);
        if (downloadCount !== null) {
            data.downloadCount = downloadCount;
        }
        
        return data;
    } catch (error) {
        console.error(`Error fetching package details for ${packageName}:`, error);
        // Fallback to local data if GitHub fetch fails
        return getLocalPackageData(packageName);
    }
}

// Function to get all package details from GitHub
async function getAllPackageDetails() {
    try {
        const registryData = await fetchRegistryIndex();
        const packageNames = Object.keys(registryData);
        
        const packagePromises = packageNames.map(name => fetchPackageDetails(name));
        const packages = await Promise.all(packagePromises);
        
        return packages;
    } catch (error) {
        console.error('Error fetching all package details:', error);
        // Fallback to local data if GitHub fetch fails
        return getLocalAllPackageDetails();
    }
}

// Function to get download count from GitHub API
async function getGitHubDownloadCount(packageData) {
    try {
        // Extract owner and repo from homepage URL
        if (!packageData.homepage) return null;
        
        const githubUrlMatch = packageData.homepage.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!githubUrlMatch) return null;
        
        const owner = githubUrlMatch[1];
        const repo = githubUrlMatch[2];
        
        // Fetch releases data from GitHub API
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
        if (!response.ok) return null;
        
        const releases = await response.json();
        
        // Sum up download counts from all assets in all releases
        let totalDownloads = 0;
        for (const release of releases) {
            if (release.assets) {
                for (const asset of release.assets) {
                    totalDownloads += asset.download_count || 0;
                }
            }
        }
        
        return totalDownloads;
    } catch (error) {
        console.error('Error fetching download count from GitHub API:', error);
        return null;
    }
}

// Local fallback data
function getLocalRegistryData() {
    return {
        "nurashade-reversegeo": {
            "latest": "1.0.0",
            "versions": ["1.0.0"]
        },
        "nurashadeweather": {
            "latest": "1.0.0",
            "versions": ["1.0.0"]
        }
    };
}

function getLocalPackageData(packageName) {
    const packageData = {
        "nurashade-reversegeo": {
            "name": "nurashade-reversegeo",
            "author": "nurashade",
            "description": "NuraShade Reverse Geo is a Rainmeter configuration component that provides reverse geocoding capabilities using the BigDataCloud API. Given a latitude and longitude, it retrieves detailed location information including country, city, subdivision, continent, postcode, and more. This package is designed to complement the NuraShade weather suite and enhance location-based displays in Rainmeter modules.",
            "homepage": "https://github.com/NuraShade/NuraShadeReverseGeo",
            "license": "Creative Commons Attribution-ShareAlike 3.0 Unported",
            "versions": {
                "1.0.0": {
                    "download": "https://github.com/NuraShade/NuraShadeReverseGeo/releases/download/v1.0.0/nurashade-reversegeo_v1.0.0.zip"
                },
                "latest": "1.0.0"
            },
            "dependencies": {},
            "icon": "fas fa-map-marker-alt"
        },
        "nurashadeweather": {
            "name": "nurashadeweather",
            "author": "nurashade",
            "description": "NuraShade Weather Measures is a collection of Rainmeter configuration files that provide comprehensive weather forecasting capabilities using the Open-Meteo API. This package includes measures for current weather conditions, 7-day forecasts, and 7-hour hourly forecasts. Most numerical measures include both precise and rounded variants for flexible display options.",
            "homepage": "https://github.com/NuraShade/NuraShadeWeather",
            "license": "Creative Commons Attribution-ShareAlike 3.0 Unported",
            "versions": {
                "1.0.0": {
                    "download": "https://github.com/NuraShade/NuraShadeWeather/releases/download/v1.0.0/nurashadeweather_v1.0.0.zip"
                },
                "latest": "1.0.0"
            },
            "dependencies": {},
            "icon": "fas fa-cloud-sun"
        }
    };
    
    return packageData[packageName] || null;
}

function getLocalAllPackageDetails() {
    const packages = [
        "nurashade-reversegeo",
        "nurashadeweather"
    ];
    
    return packages.map(name => getLocalPackageData(name)).filter(pkg => pkg !== null);
}

// Package Functions
// Global variables to track packages
let allPackages = [];
let displayedPackages = [];
let currentPage = 1;
const packagesPerPage = 6;

// Package search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load packages when page loads
    loadPackages();
    
    const searchInput = document.getElementById('package-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterPackages(searchTerm);
        });
    }
    
    // Handle button clicks using event delegation
    const packagesContainer = document.getElementById('packages-grid');
    const featuredContainer = document.getElementById('featured-packages-grid');
    
    function handlePackageAction(e) {
        const detailsButton = e.target.closest('.btn-secondary');
        
        if (detailsButton) {
            const packageCard = detailsButton.closest('.package-card');
            const packageName = packageCard.querySelector('.package-name').textContent;
            // Redirect to package detail page instead of showing modal
            window.location.href = `package/detail.html?name=${encodeURIComponent(packageName)}`;
        }
    }
    
    if (packagesContainer) {
        packagesContainer.addEventListener('click', handlePackageAction);
    }
    
    if (featuredContainer) {
        featuredContainer.addEventListener('click', handlePackageAction);
    }
    
    // Load more packages functionality
    const loadMoreButton = document.getElementById('load-more-btn');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            loadMorePackages();
        });
    }
    
    // Modal close functionality - REMOVED as we're using individual package pages
});

// Function to load packages from registry
async function loadPackages() {
    try {
        const packages = await getAllPackageDetails();
        allPackages = packages;
        displayedPackages = [...packages];
        
        displayPackages(packages.slice(0, packagesPerPage));
        displayFeaturedPackages(packages);
        
        // Hide load more button if all packages are displayed
        const loadMoreButton = document.getElementById('load-more-btn');
        if (packages.length <= packagesPerPage) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading packages:', error);
        document.getElementById('packages-grid').innerHTML = '<div class="error-message">Failed to load packages. Please try again later.</div>';
    }
}

// Function to display packages
function displayPackages(packages) {
    const packagesGrid = document.getElementById('packages-grid');
    
    if (!packages || packages.length === 0) {
        packagesGrid.innerHTML = '<div class="no-packages-message">No packages found.</div>';
        return;
    }
    
    let packagesHTML = '';
    
    packages.forEach(pkg => {
        packagesHTML += `
            <div class="package-card" data-package-name="${pkg.name}">
                <div class="package-header">
                    ${pkg.icon ? `
                        <div class="package-icon">
                            <i class="${pkg.icon}"></i>
                        </div>
                    ` : ''}
                    <div class="package-info">
                        <h3 class="package-name">${pkg.name}</h3>
                        <p class="package-author">by ${pkg.author}</p>
                    </div>
                </div>
                <p class="package-description">
                    ${pkg.description}
                </p>
                <div class="package-meta">
                    <span class="package-version">v${pkg.versions.latest}</span>
                    ${pkg.downloadCount !== undefined ? `<span class="package-downloads"><i class="fas fa-download"></i> ${pkg.downloadCount}</span>` : ''}
                </div>
                <div class="package-actions">
                    <button class="btn btn-secondary">View Details</button>
                </div>
            </div>
        `;
    });
    
    // If this is the first load, replace the loading message
    // Otherwise, append to existing packages
    if (currentPage === 1) {
        packagesGrid.innerHTML = packagesHTML;
    } else {
        packagesGrid.innerHTML += packagesHTML;
    }
}

// Function to display featured packages
function displayFeaturedPackages(packages) {
    const featuredGrid = document.getElementById('featured-packages-grid');
    
    if (!packages || packages.length === 0) {
        featuredGrid.innerHTML = '<div class="no-packages-message">No featured packages available.</div>';
        return;
    }
    
    // For now, we'll feature the first package as an example
    if (packages.length > 0) {
        const featuredPkg = packages[0];
        const featuredHTML = `
            <div class="package-card featured" data-package-name="${featuredPkg.name}">
                <div class="package-badge">Featured</div>
                <div class="package-header">
                    ${featuredPkg.icon ? `
                        <div class="package-icon">
                            <i class="${featuredPkg.icon}"></i>
                        </div>
                    ` : ''}
                    <div class="package-info">
                        <h3 class="package-name">${featuredPkg.name}</h3>
                        <p class="package-author">by ${featuredPkg.author}</p>
                    </div>
                </div>
                <p class="package-description">
                    ${featuredPkg.description}
                </p>
                <div class="package-meta">
                    <span class="package-version">v${featuredPkg.versions.latest}</span>
                    ${featuredPkg.downloadCount !== undefined ? `<span class="package-downloads"><i class="fas fa-download"></i> ${featuredPkg.downloadCount}</span>` : ''}
                </div>
                <div class="package-actions">
                    <button class="btn btn-secondary">View Details</button>
                </div>
            </div>
        `;
        
        featuredGrid.innerHTML = featuredHTML;
    }
}

// Function to filter packages based on search term
function filterPackages(searchTerm) {
    if (!searchTerm) {
        // If no search term, show all packages
        displayedPackages = [...allPackages];
        currentPage = 1;
        displayPackages(displayedPackages.slice(0, packagesPerPage));
    } else {
        // Filter packages based on search term
        displayedPackages = allPackages.filter(pkg => 
            pkg.name.toLowerCase().includes(searchTerm) || 
            pkg.author.toLowerCase().includes(searchTerm) || 
            pkg.description.toLowerCase().includes(searchTerm)
        );
        
        // Reset pagination and display filtered packages
        currentPage = 1;
        displayPackages(displayedPackages.slice(0, packagesPerPage));
    }
    
    // Show/hide load more button based on filtered results
    const loadMoreButton = document.getElementById('load-more-btn');
    if (displayedPackages.length <= packagesPerPage) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
}

// Function to load more packages
function loadMorePackages() {
    currentPage++;
    const startIndex = (currentPage - 1) * packagesPerPage;
    const endIndex = startIndex + packagesPerPage;
    const packagesToDisplay = displayedPackages.slice(startIndex, endIndex);
    
    displayPackages(packagesToDisplay);
    
    // Hide load more button if all packages are displayed
    const loadMoreButton = document.getElementById('load-more-btn');
    if (endIndex >= displayedPackages.length) {
        loadMoreButton.style.display = 'none';
    }
}

// Package Detail Functions
// Get package name from URL parameter
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Configure marked.js options
marked.setOptions({
    gfm: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: function(code, lang) {
        // Simple syntax highlighting
        return code;
    }
});

// Fetch and render markdown content using marked.js
async function fetchAndRenderMarkdown(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdownText = await response.text();
        // Use marked.js to convert markdown to HTML
        return marked.parse(markdownText);
    } catch (error) {
        console.error('Error fetching markdown:', error);
        return '<p>Error loading documentation. Please visit the <a href="' + url + '" target="_blank">source</a> directly.</p>';
    }
}

// Display package details
async function displayPackageDetails(packageName) {
    try {
        // Update the page title
        document.title = packageName + ' - Rainmeas';
        
        // Update breadcrumb
        document.getElementById('package-name-breadcrumb').textContent = packageName;
        
        const pkg = await fetchPackageDetails(packageName);
        if (!pkg) {
            document.getElementById('package-readme').innerHTML = '<div class="error-message">Package not found.</div>';
            return;
        }
        
        // Update header information
        document.getElementById('package-title').textContent = pkg.name;
        document.getElementById('package-author').textContent = 'by ' + pkg.author;
        
        // Update sidebar information
        document.getElementById('package-version').textContent = 'v' + pkg.versions.latest;
        document.getElementById('package-license').textContent = pkg.license || 'Not specified';
        
        // Format versions list
        const versionsList = Object.keys(pkg.versions)
            .filter(v => v !== 'latest')
            .join(', ') || 'None';
        document.getElementById('package-versions').textContent = versionsList;
        
        // Add download count if available
        if (pkg.downloadCount !== undefined) {
            const downloadItem = document.createElement('div');
            downloadItem.className = 'package-detail-item';
            downloadItem.innerHTML = `
                <div class="package-detail-label">Downloads</div>
                <div class="package-detail-value"><i class="fas fa-download"></i> ${pkg.downloadCount}</div>
            `;
            
            // Insert before the last item (installation card)
            const packageDetailCard = document.querySelector('.package-detail-card');
            const lastItem = packageDetailCard.querySelector('.package-detail-item:last-child');
            lastItem.parentNode.insertBefore(downloadItem, lastItem);
        }
        
        // Update installation command
        document.getElementById('install-command').textContent = 'rainmeas install ' + pkg.name;
        
        // Update GitHub link
        const githubLink = document.getElementById('github-link');
        if (pkg.homepage) {
            githubLink.href = pkg.homepage;
        } else {
            githubLink.style.display = 'none';
        }
        
        // Package icon functionality removed as per project specification
        
        // Fetch and render README if available
        if (pkg.markdown) {
            const readmeHtml = await fetchAndRenderMarkdown(pkg.markdown);
            document.getElementById('package-readme').innerHTML = readmeHtml;
        } else {
            // If no markdown, show description
            document.getElementById('package-readme').innerHTML = '<p>' + pkg.description + '</p>';
        }
        
    } catch (error) {
        console.error('Error loading package details:', error);
        document.getElementById('package-readme').innerHTML = '<div class="error-message">Failed to load package details. Please try again later.</div>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const packageName = getParameterByName('name');
    if (packageName) {
        displayPackageDetails(packageName);
    } else {
        document.getElementById('package-readme').innerHTML = '<div class="error-message">No package specified.</div>';
    }
});

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

// CodeBlock Component
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

// CodeTerminal Component
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