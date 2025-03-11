document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel if present on the page
    window.Carousel.initImageCarousel();
    window.Carousel.initInterestsCarousel();
    
    // Initialize travel form utilities
    if (window.TravelUtils) {
        window.TravelUtils.initCountryAutocomplete();
        window.TravelUtils.initTravelFormDates();
    }
});
