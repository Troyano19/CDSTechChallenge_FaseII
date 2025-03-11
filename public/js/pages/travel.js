/**
 * JavaScript functionality for the travel page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize travel form utilities
    if (window.TravelUtils) {
        window.TravelUtils.initCountryAutocomplete();
        window.TravelUtils.initTravelFormDates();
        window.TravelUtils.initFormFromQueryParams();
    }
});
