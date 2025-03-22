const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Options for MongoDB connection (removed deprecated options)
const options = {
    autoIndex: true
};

// Connect to MongoDB
const connectDB = async () => {
    try {
        //URI de la base de datos
        const dbURI = process.env.MONGODB_URI;
        mongoose.connection.on("error", (error) => {
            console.error(`❌ Ha ocurrido un error con MongoDB: ${error}.`);
        });
        mongoose.connection.on("connected", () => {
            console.log(`📦 Conexión a MongoDB establecida correctamente: ${mongoose.connection.name}.`);
        });
        mongoose.connection.on("disconnected", () => {
            console.log(`❌ Desconexión con la base de datos.`);
        });

        return mongoose.connect(dbURI);
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
