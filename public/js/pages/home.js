import { searchFlights,saveAirports, getAvailableFlights } from "../modules/rest-api/rayanairRestApi.mjs";

// Initialize page loader before DOM content is loaded
if (window.PageLoader) {
    window.PageLoader.initPageLoader();
}

const searchHandler = async (event) => {
    event.preventDefault();

    const form = new FormData(document.forms["travelForm"]);
    const originInput = document.getElementById("origin");
    const englishData = originInput.dataset.englishData;
    const parsedData = JSON.parse(englishData);
    const city = parsedData.name;
    const country = parsedData.country;
    const countryCode = parsedData.countryCode;
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');

    // Recuperar los valores    
    const adults = parseInt(adultsInput.value, 10); // Convertir a número
    const children = parseInt(childrenInput.value, 10); // Convertir a número
    const datos = {
        city,
        country,
        departureDate: form.get('departureDate'),
        returnDate: form.get('returnDate'),
        adults,
        children,
        countryCode: countryCode
    };
    const url = `/travel?city=${datos.city}&country=${datos.country}&departureDate=${datos.departureDate}` +
    `&returnDate=${datos.returnDate}&adults=${datos.adults}&children=${datos.children}`;
    window.location = url;
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
