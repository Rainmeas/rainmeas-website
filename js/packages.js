// Package search functionality
document.addEventListener('DOMContentLoaded', function() {
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
    const installButtons = document.querySelectorAll('.btn-primary');
    installButtons.forEach(button => {
        button.addEventListener('click', function() {
            const packageCard = this.closest('.package-card');
            const packageName = packageCard.querySelector('.package-name').textContent;
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Installing...';
            this.disabled = true;
            
            // Simulate installation process
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Installed';
                this.classList.remove('btn-primary');
                this.classList.add('btn-secondary');
                
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
        });
    });
    
    // Load more packages functionality
    const loadMoreButton = document.querySelector('.load-more .btn');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            // Simulate loading more packages
            setTimeout(() => {
                this.innerHTML = originalText;
                
                // In a real implementation, this would fetch more packages from the server
                alert('In a real implementation, this would load more packages from the registry.');
            }, 1500);
        });
    }
});