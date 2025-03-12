/**
 * Shared functionality for business pages (activities, establishments, trails)
 */

// Initialize page loader before DOM content is loaded
if (window.PageLoader) {
    window.PageLoader.initPageLoader();
}

document.addEventListener('DOMContentLoaded', function() {
    // Preload carousel images if possible
    if (window.CarouselData && window.PageLoader) {
        const imagesToPreload = window.PageLoader.extractCarouselImages(window.CarouselData);
        window.PageLoader.preloadImages(imagesToPreload);
    }
    
    // Detect which page we're on and load the appropriate data
    initPageCarousels();
    
    // Check if user is logged in and show/hide nearby section accordingly
    checkUserLoginState();
});

/**
 * Initialize carousel data and functionality based on current page
 */
function initPageCarousels() {
    if (!window.CarouselData || !window.CarouselRenderer) return;
    
    // Get the current page type
    const currentPath = window.location.pathname;
    let pageType, nearbyData, recommendedData;
    
    // Determine page type and get appropriate data
    if (currentPath.includes('activities')) {
        pageType = 'activity';
        nearbyData = window.CarouselData.activities.nearby;
        recommendedData = window.CarouselData.activities.recommended;
    } else if (currentPath.includes('establishments')) {
        pageType = 'establishment';
        nearbyData = window.CarouselData.establishments.nearby;
        recommendedData = window.CarouselData.establishments.recommended;
    } else if (currentPath.includes('trails')) {
        pageType = 'trail';
        nearbyData = window.CarouselData.trails.nearby;
        recommendedData = window.CarouselData.trails.recommended;
    } else {
        return; // Not a business page
    }
    
    // Render the carousel items
    window.CarouselRenderer.renderBusinessItems('.nearby-carousel', nearbyData, pageType);
    window.CarouselRenderer.renderBusinessItems('.recommendations-carousel', recommendedData, pageType);
    
    // Initialize carousel functionality
    if (window.Carousel) {
        window.Carousel.initBusinessCarousel('.nearby-carousel', '.nearby-prev', '.nearby-next');
        window.Carousel.initBusinessCarousel('.recommendations-carousel', '.recommendations-prev', '.recommendations-next');
    }
}

/**
 * Check if user is logged in and show/hide the nearby section
 * This is a placeholder - replace with actual login check logic
 */
function checkUserLoginState() {
    // For now, this is just a placeholder
    // In a real implementation, you would check session status or token
    const isLoggedIn = true; // This should be determined dynamically
    
    const nearbySection = document.querySelector('.nearby-section');
    if (nearbySection) {
        if (!isLoggedIn) {
            nearbySection.style.display = 'none';
        }
    }
}

/**
 * Navigate to the detail page when clicking on a business item
 * @param {string} type - The type of business (activity, establishment, trail)
 * @param {string} id - The ID of the specific business
 */
function navigateToDetail(type, id) {
    let url;
    
    switch(type) {
        case 'activity':
            url = `/activitys/activity/${id}`;
            break;
        case 'establishment':
            url = `/establishments/establishment/${id}`;
            break;
        case 'trail':
            url = `/trails/trail/${id}`;
            break;
        default:
            return;
    }
    
    window.location.href = url;
}
