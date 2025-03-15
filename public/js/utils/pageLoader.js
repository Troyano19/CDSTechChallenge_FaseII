/**
 * Page loading utilities
 * Handles showing content only when critical elements have loaded
 */

/**
 * Initialize page loading control
 * Shows a loading indicator only if loading takes more than 2.5 seconds
 */
function initPageLoader() {
    // Set loading state
    document.body.classList.add('loading');
    
    // Create loading overlay but keep it hidden initially
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay hidden';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Cargando...</p>
    `;
    document.body.appendChild(loadingOverlay);
    
    // Wait for window load or timeout (whichever comes first)
    let pageLoaded = false;
    let showOverlayTimer;
    
    // Only show loading overlay if page takes more than 2.5 seconds to load
    showOverlayTimer = setTimeout(() => {
        if (!pageLoaded) {
            loadingOverlay.classList.remove('hidden');
        }
    }, 50);
    
    // Event listener for when all resources have loaded
    window.addEventListener('load', () => {
        if (!pageLoaded) {
            pageLoaded = true;
            clearTimeout(showOverlayTimer);
            showPage();
        }
    });
    
    // Safety timeout - show page after 8 seconds even if not all images have loaded
    setTimeout(() => {
        if (!pageLoaded) {
            pageLoaded = true;
            clearTimeout(showOverlayTimer);
            showPage();
        }
    }, 8000);
    
    // Function to show the page when ready
    function showPage() {
        // Add a short delay for a smooth transition
        setTimeout(() => {
            document.body.classList.remove('loading');
            loadingOverlay.classList.add('fade-out');
            
            // Remove overlay after fade animation
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, 200);
    }
}

/**
 * Preload specific images before showing content
 * @param {Array} imageSources - Array of image URLs to preload
 * @returns {Promise} Promise that resolves when all images are loaded
 */
function preloadImages(imageSources) {
    const imagePromises = imageSources.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve; // Resolve anyway to prevent blocking on image failure
            img.src = src;
        });
    });
    
    return Promise.all(imagePromises);
}

/**
 * Extract image sources from carousel data
 * @param {Object} carouselData - Carousel data object
 * @returns {Array} Array of image URLs
 */
function extractCarouselImages(carouselData) {
    if (!carouselData) return [];
    
    const images = [];
    
    // Extract from interests
    if (carouselData.interests) {
        carouselData.interests.forEach(item => {
            if (item.image) images.push(item.image);
        });
    }
    
    // Extract from activities
    if (carouselData.activities) {
        if (carouselData.activities.nearby) {
            carouselData.activities.nearby.forEach(item => {
                if (item.image) images.push(item.image);
            });
        }
        if (carouselData.activities.recommended) {
            carouselData.activities.recommended.forEach(item => {
                if (item.image) images.push(item.image);
            });
        }
    }
    
    // Extract from establishments
    if (carouselData.establishments) {
        if (carouselData.establishments.nearby) {
            carouselData.establishments.nearby.forEach(item => {
                if (item.image) images.push(item.image);
            });
        }
        if (carouselData.establishments.recommended) {
            carouselData.establishments.recommended.forEach(item => {
                if (item.image) images.push(item.image);
            });
        }
    }
    
    // Extract from trails
    if (carouselData.trails) {
        if (carouselData.trails.nearby) {
            carouselData.trails.nearby.forEach(item => {
                if (item.image) images.push(item.image);
            });
        }
        if (carouselData.trails.recommended) {
            carouselData.trails.recommended.forEach(item => {
                if (item.image) images.push(item.image);
            });
        }
    }
    
    // Remove duplicates
    return [...new Set(images)];
}

// Export utilities through window object
window.PageLoader = {
    initPageLoader,
    preloadImages,
    extractCarouselImages
};
