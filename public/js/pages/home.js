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
