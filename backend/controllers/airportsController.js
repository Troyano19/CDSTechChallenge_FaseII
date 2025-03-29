const airportsDB = require("../models/airportsModel");

// Controlador para guardar múltiples aeropuertos
const saveAirports = async (req, res) => {
    const ryanair = await import('@2bad/ryanair');
    const { airports } = ryanair;
    try {
        const aeropuertos = await airports.getActive();
        // Guardar los aeropuertos en la base de datos
        console.log(aeropuertos); // Para depuración
        const savedAirports = await airportsDB.insertMany(aeropuertos);
        res.status(201).json({ message: "Aeropuertos guardados exitosamente.", data: savedAirports });
    } catch (error) {
        console.error("Error al guardar aeropuertos:", error.message);
        res.status(500).json({ error: "Error al guardar aeropuertos." });
    }
};

const getAvailableFlights = async (req, res) => {
    try{
        const req = await fetch('https://www.ryanair.com/api/booking/v4/en-gb/availability?ADT=1&CHD=0&DateIn=&DateOut=2025-04-01&Destination=BRU&Disc=0&FlexDaysBeforeIn=2&FlexDaysBeforeOut=4&FlexDaysIn=2&FlexDaysOut=2&IncludeConnectingFlights=false&INF=0&Origin=MAD&promoCode=&RoundTrip=false&TEEN=0&ToUs=AGREED');        fetch('https://www.ryanair.com/api/booking/v4/en-gb/availability?ADT=1&CHD=0&DateIn=&DateOut=2025-04-01&Destination=BRU&Disc=0&FlexDaysBeforeIn=2&FlexDaysBeforeOut=4&FlexDaysIn=2&FlexDaysOut=2&IncludeConnectingFlights=false&INF=0&Origin=MAD&promoCode=&RoundTrip=false&TEEN=0&ToUs=AGREED')
        console.log(await req.json());
    
        res.status(200).json({ message: "Vuelos disponibles obtenidos exitosamente." });
    }catch(error) {
        console.error("Error al obtener vuelos disponibles:", error);
        res.status(500).json({ error: "Error al obtener vuelos disponibles." });
    };
};

const getAirportsFromCity = async (req, res) => {
    const { city } = req.params;
    try{
        const airports = await airportsDB.find({ "city.name": city });
        if (airports.length === 0) {
            return res.status(404).json({ message: "No se encontraron aeropuertos para la ciudad especificada." });
        }
        res.status(200).json(airports);
    }catch(error) {
        console.error("Error al obtener aeropuertos:", error);
        res.status(500).json({ error: "Error al obtener aeropuertos." });
    };
};



module.exports = {
    saveAirports,
    getAvailableFlights,
    getAirportsFromCity,
};
