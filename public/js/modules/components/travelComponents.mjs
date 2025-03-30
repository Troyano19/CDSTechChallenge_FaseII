import { getAvailableFlights } from "../rest-api/rayanairRestApi.mjs"
const renderFlights = async () => {
    //Recuperamos los datos de la URL
    const params = new URLSearchParams(window.location.search);
    const queryParams = {};
    params.forEach((value, key) => {
        queryParams[key] = value;
    });
    //Recuperamos los vuelos disponibles
    const airports = await getAvailableFlights(queryParams);
    //Para ver los datos de un vuelo en concreto
    console.log(flights);
    console.log(flights[2].trips[0].dates[0].flights[0]);
    airports.forEach((airport) => {
        airport.trips[0].dates[0].flights.forEach((flight) => {
            const duration = flight.duration;
            const departure = flight.time[0];
            const arrival = flight.time[1];
            const price = flight.regularFare.fares[0].amount;
            
        });
    });

    // });

}

export { renderFlights }