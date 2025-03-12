/**
 * Shared functionality for business pages (activities, establishments, trails)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize both carousels on the page
    initBusinessCarousels();
    
    // Check if user is logged in and show/hide nearby section accordingly
    checkUserLoginState();
});

/**
 * Initialize carousels for nearby places and recommendations
 */
function initBusinessCarousels() {
    // Check if Carousel functionality is available
    if (window.Carousel) {
        // Use the business carousel initialization function for both carousels
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
