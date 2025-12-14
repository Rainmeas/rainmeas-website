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
        
        // Set up copy button
        const copyButton = document.querySelector('.copy-command-btn');
        copyButton.addEventListener('click', function() {
            const command = document.getElementById('install-command').textContent;
            navigator.clipboard.writeText(command).then(() => {
                // Show feedback
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    this.innerHTML = originalIcon;
                }, 2000);
            });
        });
        
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