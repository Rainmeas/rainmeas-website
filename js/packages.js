// Package search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load packages when page loads
    loadPackages();
    
    const searchInput = document.getElementById('package-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const packageCards = document.querySelectorAll('.package-card');
            
            packageCards.forEach(card => {
                const packageName = card.querySelector('.package-name').textContent.toLowerCase();
                const packageAuthor = card.querySelector('.package-author').textContent.toLowerCase();
                const packageDescription = card.querySelector('.package-description').textContent.toLowerCase();
                
                if (packageName.includes(searchTerm) || 
                    packageAuthor.includes(searchTerm) || 
                    packageDescription.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Package installation simulation
    const packagesContainer = document.getElementById('packages-grid');
    if (packagesContainer) {
        packagesContainer.addEventListener('click', function(e) {
            if (e.target.closest('.btn-primary')) {
                const button = e.target.closest('.btn-primary');
                const packageCard = button.closest('.package-card');
                const packageName = packageCard.querySelector('.package-name').textContent;
                
                // Show loading state
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Installing...';
                button.disabled = true;
                
                // Simulate installation process
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check"></i> Installed';
                    button.classList.remove('btn-primary');
                    button.classList.add('btn-secondary');
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'install-success';
                    successMessage.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        Successfully installed ${packageName}!
                        <button class="close-message">&times;</button>
                    `;
                    
                    document.body.appendChild(successMessage);
                    
                    // Auto-hide message after 3 seconds
                    setTimeout(() => {
                        successMessage.style.opacity = '0';
                        setTimeout(() => {
                            successMessage.remove();
                        }, 300);
                    }, 3000);
                    
                    // Close button for message
                    successMessage.querySelector('.close-message').addEventListener('click', function() {
                        successMessage.style.opacity = '0';
                        setTimeout(() => {
                            successMessage.remove();
                        }, 300);
                    });
                }, 2000);
            }
        });
    }
    
    // Load more packages functionality
    const loadMoreButton = document.getElementById('load-more-btn');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            // Simulate loading more packages
            setTimeout(() => {
                this.innerHTML = originalText;
                
                // In a real implementation, this would fetch more packages from the registry
                alert('In a real implementation, this would load more packages from the registry.');
            }, 1500);
        });
    }
});

// Function to load packages from registry
async function loadPackages() {
    try {
        const packages = await getAllPackageDetails();
        displayPackages(packages);
        displayFeaturedPackages(packages);
    } catch (error) {
        console.error('Error loading packages:', error);
        document.getElementById('packages-grid').innerHTML = '<div class="error-message">Failed to load packages. Please try again later.</div>';
    }
}

// Function to display packages
function displayPackages(packages) {
    const packagesGrid = document.getElementById('packages-grid');
    
    if (!packages || packages.length === 0) {
        packagesGrid.innerHTML = '<div class="no-packages-message">No packages found in registry.</div>';
        return;
    }
    
    let packagesHTML = '';
    
    packages.forEach(pkg => {
        packagesHTML += `
            <div class="package-card">
                <div class="package-header">
                    <div class="package-icon">
                        <i class="${pkg.icon || 'fas fa-box-open'}"></i>
                    </div>
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
                    <span class="package-downloads"><i class="fas fa-download"></i> ${formatDownloads(pkg.downloads || 0)}</span>
                </div>
                <div class="package-actions">
                    <button class="btn btn-secondary">Details</button>
                    <button class="btn btn-primary">Install</button>
                </div>
            </div>
        `;
    });
    
    packagesGrid.innerHTML = packagesHTML;
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
            <div class="package-card featured">
                <div class="package-badge">Featured</div>
                <div class="package-header">
                    <div class="package-icon">
                        <i class="${featuredPkg.icon || 'fas fa-star'}"></i>
                    </div>
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
                    <span class="package-downloads"><i class="fas fa-download"></i> ${formatDownloads(featuredPkg.downloads || 0)}</span>
                </div>
                <div class="package-actions">
                    <button class="btn btn-secondary">Details</button>
                    <button class="btn btn-primary">Install</button>
                </div>
            </div>
        `;
        
        featuredGrid.innerHTML = featuredHTML;
    }
}

// Helper function to format download numbers
function formatDownloads(downloads) {
    if (downloads >= 1000) {
        return (downloads / 1000).toFixed(1) + 'k';
    }
    return downloads;
}