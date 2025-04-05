import { getAvailableFlights } from "../rest-api/rayanairRestApi.mjs"


const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formato HH:MM
};

const renderFlights = async () => {
    //Recuperamos los datos de la URL
    const params = new URLSearchParams(window.location.search);
    const queryParams = {};
    params.forEach((value, key) => {
        queryParams[key] = value;
    });
    //Recuperamos los vuelos disponibles
    const airports = await getAvailableFlights(queryParams);
    const transports = document.getElementById("transports");
    
    const translations = window.Translations[window.currentLanguage].travel.transport;
    transports.insertAdjacentHTML("beforebegin", `<h2>${translations.outboundFlights}</h2>`);
    
    airports.forEach((airport) => {
        if(airport.trips[0].dates[0].flights.length === 0 && transports.innerHTML.length === 0){
            transports.innerHTML = `<p>${translations.noOutboundFlights}</p>`;
            return;
        };
        const currency = airport.currency;
        airport.trips[0].dates[0].flights.forEach((flight) => {
            
            const destination = airport.trips[0].destinationName;
            const origin = airport.trips[0].originName;
            const duration = flight.duration;
            const departure = formatTime(flight.time[0]); 
            const arrival = formatTime(flight.time[1]); 
            const price = flight.regularFare.fares[0].amount;
            
            transports.insertAdjacentHTML("beforeend", `
                <div class="transport-item">
                    <div class="company-info">
                        <h3>Ryanair</h3>
                        <div class="price">
                            <span class="count">${price}</span>
                            <span class="badge">${currency}</span>
                        </div>
                    </div>
                    <div class="route-info">
                        <div class="origin">
                            <span class="label" data-translate="travel.transport.origin">${translations.origin}</span>
                            <span class="location">${origin}</span>
                        </div>
                        <div class="destination">
                            <span class="label" data-translate="travel.transport.destination">${translations.destination}</span>
                            <span class="location">${destination}</span>
                        </div>
                    </div>
                    <div class="schedule-info">
                        <div class="departure">
                            <span class="label" data-translate="travel.transport.departure">${translations.departure}</span>
                            <span class="time">${departure}</span>
                        </div>
                        <div class="arrival">
                            <span class="label" data-translate="travel.transport.arrival">${translations.arrival}</span>
                            <span class="time">${arrival}</span>
                        </div>
                        <div class="duration">
                            <span class="label" data-translate="travel.transport.duration">${translations.duration}</span>
                            <span class="time">${duration}</span>
                        </div>
                    </div>
                </div>
            `);

        if(airport.trips.length > 1){
            airport.trips[1].dates[0].flights.forEach((flight) =>{
                transports.insertAdjacentHTML("beforeend", `<h2>${translations.returnFlights}</h2>`);
                const destination = airport.trips[1].destinationName;
                const origin = airport.trips[1].originName;
                const duration = flight.duration;
                const departure = formatTime(flight.time[0]); 
                const arrival = formatTime(flight.time[1]); 
                const price = flight.regularFare.fares[0].amount;
                transports.insertAdjacentHTML("beforeend", `
                    <div class="transport-item">
                        <div class="company-info">
                            <h3>Ryanair</h3>
                            <div class="price">
                                <span class="count">${price}</span>
                                <span class="badge">${currency}</span>
                            </div>
                        </div>
                        <div class="route-info">
                            <div class="origin">
                                <span class="label" data-translate="travel.transport.origin">${translations.origin}</span>
                                <span class="location">${origin}</span>
                            </div>
                            <div class="destination">
                                <span class="label" data-translate="travel.transport.destination">${translations.destination}</span>
                                <span class="location">${destination}</span>
                            </div>
                        </div>
                        <div class="schedule-info">
                            <div class="departure">
                                <span class="label" data-translate="travel.transport.departure">${translations.departure}</span>
                                <span class="time">${departure}</span>
                            </div>
                            <div class="arrival">
                                <span class="label" data-translate="travel.transport.arrival">${translations.arrival}</span>
                                <span class="time">${arrival}</span>
                            </div>
                            <div class="duration">
                                <span class="label" data-translate="travel.transport.duration">${translations.duration}</span>
                                <span class="time">${duration}</span>
                            </div>
                        </div>
                    </div>
                `);
            });
        };
            

        });
    });

    // });

}

export { renderFlights }