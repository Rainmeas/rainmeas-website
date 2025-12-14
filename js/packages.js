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

// REMOVED showPackageDetails function as we're now using individual package pages