const ryanairURL = "https://www.ryanair.com/api/views/locate/5/airports/en/active";
const baseURL = "/api/transports/ryanair"; 

const getActiveAirports = async () => {
    return fetch(ryanairURL);
};

const saveAirports = async () => {
    const aeropuertos = await getActiveAirports();
    const datos = await aeropuertos.json();
    return fetch(`${baseURL}/saveAirports`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(datos),
        credentials: "include",
    });
};

const searchFlights = async (origin, outboundDate, inboundDate, adults = 1, teens = 0, children = 0, infants = 0) => {
    //Buscar el aeropuerto de murcia
    const url = `${ryanairURL}/searchFlights?origin=${encodeURIComponent(origin)}&destination=&outboundDate=${encodeURIComponent(outboundDate)}&inboundDate=${encodeURIComponent(inboundDate)}&adults=${encodeURIComponent(adults)}&teens=${encodeURIComponent(teens)}&children=${encodeURIComponent(children)}&infants=${encodeURIComponent(infants)}`;

    return fetch(url, {
        method: "GET",
        headers: {
            'x-rapiadi-key': "f682378a1dmsh920c02e136ed768p1062e8jsna1de3f542001",
            'x-rapidapi-host': "ryanair2.p.rapidapi.com",
        }
    });
};

export {getActiveAirports, searchFlights, saveAirports };