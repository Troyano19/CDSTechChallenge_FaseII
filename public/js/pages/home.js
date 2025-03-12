document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel if present on the page
    window.Carousel.initImageCarousel();
    
    // Render interest cards and initialize carousel
    if (window.CarouselData && window.CarouselRenderer) {
        // Render interest cards
        window.CarouselRenderer.renderInterestCards(
            '.interests-carousel.what-to-see',
            window.CarouselData.interests
        );
        
        // Initialize carousel functionality
        window.Carousel.initInterestsCarousel();
    }
    
    // Initialize travel form utilities
    if (window.TravelUtils) {
        window.TravelUtils.initCountryAutocomplete();
        window.TravelUtils.initTravelFormDates();
    }
});
