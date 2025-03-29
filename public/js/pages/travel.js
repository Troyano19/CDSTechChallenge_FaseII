import { renderFlights } from "../modules/components/travelComponents.mjs";
/**
 * JavaScript functionality for the travel page
 */

// Initialize page loader before DOM content is loaded
if (window.PageLoader) {
    window.PageLoader.initPageLoader();
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize travel form utilities
    renderFlights();
    if (window.TravelUtils) {
        window.TravelUtils.initCityCountryAutocomplete();
        window.TravelUtils.initTravelFormDates();
        window.TravelUtils.initFormFromQueryParams();
    }
});
