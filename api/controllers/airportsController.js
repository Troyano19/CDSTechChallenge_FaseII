const airportsDB = require("../models/airportsModel");

// Controlador para guardar múltiples aeropuertos
const saveAirports = async (req, res) => {
    try {
        const airports = req.body; // Extraer el array de aeropuertos del campo "data"
        if (!airports || !Array.isArray(airports)) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe contener un array de aeropuertos en la propiedad 'data'." });
        }
        // Guardar los aeropuertos en la base de datos
        console.log(airports.length); // Para depuración
        const savedAirports = await airportsDB.insertMany(airports);
        res.status(201).json({ message: "Aeropuertos guardados exitosamente.", data: savedAirports });
    } catch (error) {
        console.error("Error al guardar aeropuertos:", error.message);
        res.status(500).json({ error: "Error al guardar aeropuertos." });
    }
};



module.exports = {
    saveAirports,
};
