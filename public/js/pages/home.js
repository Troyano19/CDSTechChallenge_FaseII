import { searchFlights,saveAirports } from "../modules/rest-api/rayanairRestApi.mjs";

// Initialize page loader before DOM content is loaded
if (window.PageLoader) {
    window.PageLoader.initPageLoader();
}

const searchHandler = async (event) => {
    event.preventDefault();

    const form = new FormData(document.forms["travelForm"]);
    const originInput = document.getElementById("origin");
    const countryCode = originInput.dataset.countryCode; // Get the country code from the data attribute
    const datos = {
        ...Object.fromEntries(form),
        countryCode: countryCode
    };
    
    // try {
    //     const flights = await searchFlights(origin, destination, dateFrom, dateTo);

    //     // Guardar los resultados en el almacenamiento local para usarlos en travel.html
    //     localStorage.setItem("flights", JSON.stringify(flights));

    //     // Redirigir a la página travel.html
    //     window.location.href = "/travel.html";
    // } catch (error) {
    //     console.error("Error searching flights:", error);
    //     alert("Hubo un error al buscar vuelos. Por favor, inténtalo de nuevo.");
    // }
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
