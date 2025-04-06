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
    console.log(airports);
    console.log(queryParams);
    const translations = window.Translations[window.currentLanguage].travel.transport;
    transports.insertAdjacentHTML("beforebegin", `<h2>${translations.outboundFlights}</h2>`);
    
    airports.forEach((airport, airportIndex) => {
        if(airport.trips[0].dates[0].flights.length === 0 && transports.innerHTML.length === 0){
            transports.innerHTML = `<p>${translations.noOutboundFlights}</p>`;
            return;
        };
        const currency = airport.currency;
        const outboundFlights = airport.trips[0].dates[0].flights;

        outboundFlights.slice(0, 2).forEach((flight) => {
            
            const destination = airport.trips[0].destinationName;
            const origin = airport.trips[0].originName;
            const duration = flight.duration;
            const departure = formatTime(flight.time[0]); 
            const arrival = formatTime(flight.time[1]);
            
            const price = flight.faresLeft !== 0 ? flight.regularFare.fares[0].amount : flight.regularFare.fares[0].amount + " " + translations.soldOut;
            const ryanAirUrl = `https://www.ryanair.com/es/es/trip/flights/select?adults=${queryParams.adults}&teens=0&`+
                `children=${queryParams.children}&infants=0&dateOut=${queryParams.departureDate}&dateIn=${queryParams.returnDate}`+
                `&isConnectedFlight=false&discount=0&promoCode=&isReturn=true&originIata=${flight.segments[0].origin}&`+
                `destinationIata=${flight.segments[0].destination}&tpAdults=${queryParams.adults}&tpTeens=0&tpChildren=${queryParams.children}`+
                `&tpInfants=0&tpStartDate=${queryParams.departureDate}&tpEndDate=${queryParams.returnDate}&tpDiscount=0&tpPromoCode=&`+
                `tpOriginIata=${flight.segments[0].origin}&tpDestinationIata=${flight.segments[0].destination}`;

            transports.insertAdjacentHTML("beforeend", `
                <a href="${ryanAirUrl}" target="_blank" class="link">
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
                </a>
            `);
        });
        if(outboundFlights.length > 2){
            transports.insertAdjacentHTML("beforeend", `<button class="show-more-outbound" data-airport-index="${airportIndex}">${translations.showMoreOutbound || "..."}</button>`);
        };

        if(airport.trips.length > 1){
            const returnFlights = airport.trips[1].dates[0].flights.filter(flight => 
                flight.regularFare && flight.regularFare.fares && flight.regularFare.fares.length > 0
            );
            if(returnFlights.length > 0){
                // Insertamos el encabezado de vuelos de vuelta solo una vez
                if(!document.getElementById("vueltaH2")){
                  transports.insertAdjacentHTML("beforeend", `<h2 id="vueltaH2">${translations.returnFlights}</h2>`);
                }
                // Renderizamos los primeros 3 vuelos de vuelta
                returnFlights.slice(0, 2).forEach((flight) => {
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
                // Si hay más de 3 vuelos de vuelta, mostramos botón "Ver más"
                if(returnFlights.length > 2){
                    transports.insertAdjacentHTML("beforeend", `<button class="show-more-return" data-airport-index="${airportIndex}">${translations.showMoreReturn || "..."}</button>`);
                }
            }
        }
    });
        
    // Agregamos listener para "Ver más" de vuelos de ida
    document.addEventListener("click", (event) => {
        if(event.target.matches(".show-more-outbound")){
            const button = event.target;
            const airportIndex = button.getAttribute("data-airport-index");
            const airport = airports[airportIndex];
            const outboundFlights = airport.trips[0].dates[0].flights;
            outboundFlights.slice(2).forEach((flight) => {
                const destination = airport.trips[0].destinationName;
                const origin = airport.trips[0].originName;
                const duration = flight.duration;
                const departure = formatTime(flight.time[0]);
                const arrival = formatTime(flight.time[1]);
                const price = flight.faresLeft !== 0 
                    ? flight.regularFare.fares[0].amount 
                    : flight.regularFare.fares[0].amount + " " + translations.soldOut;
                const vueltaH2 = document.getElementById("vueltaH2");
                if (vueltaH2) {
                    vueltaH2.insertAdjacentHTML("beforebegin", `
                        <div class="transport-item">
                            <div class="company-info">
                                <h3>Ryanair</h3>
                                <div class="price">
                                    <span class="count">${price}</span>
                                    <span class="badge">${airport.currency}</span>
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
                } else {
                    transports.insertAdjacentHTML("beforeend", `
                        <div class="transport-item">
                            <div class="company-info">
                                <h3>Ryanair</h3>
                                <div class="price">
                                    <span class="count">${price}</span>
                                    <span class="badge">${airport.currency}</span>
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
                }
            });
            button.remove();
        };
    });
        
    // Listener para "Ver más" de vuelos de vuelta
    document.addEventListener("click", (event) => {
        if(event.target.matches(".show-more-return")){
            const button = event.target;
            const airportIndex = button.getAttribute("data-airport-index");
            const airport = airports[airportIndex];
            const returnFlights = airport.trips[1].dates[0].flights;
            returnFlights.slice(2).forEach((flight) => {
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
                                <span class="badge">${airport.currency}</span>
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
            button.remove();
        };
    });
};

export { renderFlights }