import { searchFlights,saveAirports, getAvailableFlights } from "../modules/rest-api/rayanairRestApi.mjs";

// Initialize page loader before DOM content is loaded
if (window.PageLoader) {
    window.PageLoader.initPageLoader();
}

const searchHandler = async (event) => {
    event.preventDefault();

    const form = new FormData(document.forms["travelForm"]);
    const originInput = document.getElementById("origin");
    const countryCode = originInput.dataset.countryCode;
    const [city, country] = form.get('origin').split(",").map(value => value.trim());
    const datos = {
        city,
        country,
        departureDate: form.get('departureDate'),
        returnDate: form.get('returnDate'),
        adults: form.get('adultsCount'),
        children: form.get('childrenCount'),
        countryCode: countryCode
    };
    
};

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
        window.TravelUtils.initCityCountryAutocomplete();
        window.TravelUtils.initTravelFormDates();
    }

    // Add event listener to the travel form
    document.getElementById("travelForm").addEventListener("submit", searchHandler);
});
