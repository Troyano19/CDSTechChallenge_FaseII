import { renderFlights } from "../modules/components/travelComponents.mjs";

/**
 * JavaScript functionality for the travel page
 */

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
    window.history.replaceState({}, '', url);
    renderFlights();
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize travel form utilities
    renderFlights();
    if (window.TravelUtils) {
        window.TravelUtils.initCityCountryAutocomplete();
        window.TravelUtils.initTravelFormDates();
    }
});

document.getElementById("travelForm").addEventListener("submit", searchHandler);
