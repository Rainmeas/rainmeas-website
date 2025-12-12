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
    
    // Handle button clicks using event delegation
    const packagesContainer = document.getElementById('packages-grid');
    const featuredContainer = document.getElementById('featured-packages-grid');
    
    function handlePackageAction(e) {
        const detailsButton = e.target.closest('.btn-secondary');
        const installButton = e.target.closest('.btn-primary');
        
        if (detailsButton) {
            const packageCard = detailsButton.closest('.package-card');
            const packageName = packageCard.querySelector('.package-name').textContent;
            showPackageDetails(packageName);
        } else if (installButton) {
            const packageCard = installButton.closest('.package-card');
            const packageName = packageCard.querySelector('.package-name').textContent;
            installPackage(packageName, installButton);
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
            <div class="package-card" data-package-name="${pkg.name}">
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
                    ${pkg.downloads ? `<span class="package-downloads"><i class="fas fa-download"></i> ${formatDownloads(pkg.downloads)}</span>` : ''}
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
            <div class="package-card featured" data-package-name="${featuredPkg.name}">
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
                    ${featuredPkg.downloads ? `<span class="package-downloads"><i class="fas fa-download"></i> ${formatDownloads(featuredPkg.downloads)}</span>` : ''}
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
                        <div class="package-icon">
                            <i class="${pkg.icon || 'fas fa-box-open'}"></i>
                        </div>
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

// Function to install a package
function installPackage(packageName, button) {
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Installing...';
    button.disabled = true;
    
    // Simulate installation process
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Installed';
        button.classList.remove('btn-primary');
        button.classList.add('btn-secondary');
        button.disabled = true;
        
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