/**
 * JavaScript functionality for the travel page
 */

// Initialize page loader before DOM content is loaded
if (window.PageLoader) {
    window.PageLoader.initPageLoader();
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize travel form utilities
    if (window.TravelUtils) {
        window.TravelUtils.initCountryAutocomplete();
        window.TravelUtils.initTravelFormDates();
        window.TravelUtils.initFormFromQueryParams();
    }
});
