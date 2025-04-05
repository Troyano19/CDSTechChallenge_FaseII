const ryanairURL = "https://www.ryanair.com/api/views/locate";
const baseURL = "/api/transports/ryanair"; 

const getAirportsFromCountry = async (country) => {
    return fetch(`${baseURL}/getAirportsFromCountry/${country}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
    });
};

const getAirportsFromCity = async (city) => {
    return fetch(`${baseURL}/getAirportsFromCity/${city}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
    })
};

const saveAirports = async () => {
    console.log("llega");
    return fetch(`${baseURL}/saveAirports`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: "",
        credentials: "include",
    });
};

const getAvailableFlights = async (data) => {
    const { city, country, departureDate, returnDate, countryCode, adults, children } = data;
    let airportsOriginReq = await getAirportsFromCity(city);

    if (airportsOriginReq.status !== 200) {
        airportsOriginReq = await getAirportsFromCountry(country);
    }
    const airportsOrigin = await airportsOriginReq.json();
    const codesOrigin = [];
    airportsOrigin.forEach(airport => {
        codesOrigin.push(airport.code);
    });
    
    const RoundTrip = returnDate ? true : false;
    const responses = [];
    for (const origin of codesOrigin) {
        const ryanairUrl = `https://www.ryanair.com/api/booking/v4/en-gb/availability?ADT=${adults}&CHD=${children}` +
            `&DateIn=${returnDate}&DateOut=${departureDate}&Destination=MAD&Disc=0&FlexDaysBeforeIn=0` +
            `&FlexDaysBeforeOut=0&FlexDaysIn=0&FlexDaysOut=0&IncludeConnectingFlights=false&INF=0&Origin=${origin}` +
            `&promoCode=&RoundTrip=${RoundTrip}&TEEN=0&ToUs=AGREED`;    

        //TODO: Especificar la baseURL
        const response = await fetch(`https://greenlake-portal.vercel.app/proxy/ryanair?url=${encodeURIComponent(ryanairUrl)}`);
        const data = await response.json();
        responses.push(data); // Almacenar la respuesta en el array
    }
    return responses; // Devolver todas las respuestas
};




const searchFlights = async (origin, outboundDate, inboundDate, adults = 1, teens = 0, children = 0, infants = 0) => {
    //Buscar el aeropuerto de murcia
    const url = `https://www.ryanair.com/api/booking/v4/en-gb/availability?ADT=1&CHD=0&DateIn=&DateOut={{departDate}}&Destination={{destination}}&Disc=0&INF=0&Origin={{origin}}&TEEN=0&promoCode=&IncludeConnectingFlights=false&FlexDaysBeforeOut=4&FlexDaysOut=2&FlexDaysBeforeIn=2&FlexDaysIn=2&RoundTrip=false&ToUs=AGREED`;

    return fetch(url, {
        method: "GET",
        headers: {
            'x-rapiadi-key': "f682378a1dmsh920c02e136ed768p1062e8jsna1de3f542001",
            'x-rapidapi-host': "ryanair2.p.rapidapi.com",
        }
    });
};

export { searchFlights, saveAirports, getAvailableFlights };