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
    airports.forEach((airport) => {
        console.log(airport)
        if(airport.trips[0].dates[0].flights.length === 0){
            //TODO: Generar un mensaje de no hay vuelos disponibles y salir del bucle
        };
        const destination = airport.trips[0].destinationName;
        const origin = airport.trips[0].originName;
        const currency = airport.currency;
        airport.trips[0].dates[0].flights.forEach((flight) => {
            console.log("vuelo",flight);
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
                            <span class="label" data-translate="travel.transport.origin">Origen:</span>
                            <span class="location">${origin}</span>
                        </div>
                        <div class="destination">
                            <span class="label" data-translate="travel.transport.destination">Destino:</span>
                            <span class="location">${destination}</span>
                        </div>
                    </div>
                    <div class="schedule-info">
                        <div class="departure">
                            <span class="label" data-translate="travel.transport.departure">Salida:</span>
                            <span class="time">${departure}</span>
                        </div>
                        <div class="arrival">
                            <span class="label" data-translate="travel.transport.arrival">Llegada:</span>
                            <span class="time">${arrival}</span>
                        </div>
                        <div class="duration">
                            <span class="label" data-translate="travel.transport.duration">Duración:</span>
                            <span class="time">${duration}</span>
                        </div>
                    </div>
                </div>
            `);
            

        });
    });

    // });

}

export { renderFlights }