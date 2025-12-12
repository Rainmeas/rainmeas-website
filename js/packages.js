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
            showPackageDetails(packageName);
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
    
    // Modal close functionality
    const modal = document.getElementById('package-details-modal');
    const closeModal = document.querySelector('.modal-close');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
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
                </div>
                <div class="package-actions">
                    <button class="btn btn-secondary">Details</button>
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
                </div>
                <div class="package-actions">
                    <button class="btn btn-secondary">Details</button>
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

// Function to show package details
async function showPackageDetails(packageName) {
    try {
        const pkg = await fetchPackageDetails(packageName);
        if (!pkg) {
            alert('Package not found');
            return;
        }
        
        const modal = document.getElementById('package-details-modal');
        const modalContent = document.getElementById('package-details-content');
        
        // Format the versions list
        const versionsList = Object.keys(pkg.versions)
            .filter(v => v !== 'latest')
            .join(', ') || 'None';
        
        modalContent.innerHTML = `
            <div class="package-details">
                <div class="package-details-main">
                    <div class="package-header">
                        ${pkg.icon ? `
                            <div class="package-icon">
                                <i class="${pkg.icon}"></i>
                            </div>
                        ` : ''}
                        <div class="package-info">
                            <h2 class="package-name">${pkg.name}</h2>
                            <p class="package-author">by ${pkg.author}</p>
                        </div>
                    </div>
                    
                    <h3>Description</h3>
                    <p>${pkg.description}</p>
                    
                    <h3>Installation</h3>
                    <p>Install this package using the Rainmeas CLI:</p>
                    <div class="install-command">
                        rainmeas install ${pkg.name}
                        <button class="copy-command-btn" data-command="rainmeas install ${pkg.name}">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    
                    ${pkg.versions.latest !== '1.0.0' ? `
                        <h3>Installing a Specific Version</h3>
                        <p>To install a specific version of this package:</p>
                        <div class="install-command">
                            rainmeas install ${pkg.name}@${pkg.versions.latest}
                            <button class="copy-command-btn" data-command="rainmeas install ${pkg.name}@${pkg.versions.latest}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
                
                <div class="package-details-sidebar">
                    <div class="package-detail-item">
                        <div class="package-detail-label">Version</div>
                        <div class="package-detail-value">v${pkg.versions.latest}</div>
                    </div>
                    
                    <div class="package-detail-item">
                        <div class="package-detail-label">License</div>
                        <div class="package-detail-value">${pkg.license || 'Not specified'}</div>
                    </div>
                    
                    <div class="package-detail-item">
                        <div class="package-detail-label">Homepage</div>
                        <div class="package-detail-value">
                            <a href="${pkg.homepage}" target="_blank">View on GitHub</a>
                        </div>
                    </div>
                    
                    <div class="package-detail-item">
                        <div class="package-detail-label">Versions</div>
                        <div class="package-detail-value">${versionsList}</div>
                    </div>
                    
                    ${pkg.dependencies && Object.keys(pkg.dependencies).length > 0 ? `
                        <div class="package-detail-item">
                            <div class="package-detail-label">Dependencies</div>
                            <div class="package-detail-value">
                                ${Object.keys(pkg.dependencies).join('<br>')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Add event listener for copy buttons
        const copyButtons = modalContent.querySelectorAll('.copy-command-btn');
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const command = this.getAttribute('data-command');
                navigator.clipboard.writeText(command).then(() => {
                    // Show feedback
                    const originalIcon = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    
                    setTimeout(() => {
                        this.innerHTML = originalIcon;
                    }, 2000);
                });
            });
        });
        
        // Show the modal
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error loading package details:', error);
        alert('Failed to load package details. Please try again later.');
    }
}