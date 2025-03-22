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
        if (!MONGODB_URI) {
            throw new Error('La variable de entorno MONGODB_URI no está configurada');
        }
        
        await mongoose.connect(MONGODB_URI, options);
        console.log('📦 Conexión a MongoDB establecida correctamente');
        
        // Check if users collection exists, create if not
        const collections = await mongoose.connection.db.listCollections({name: 'users'}).toArray();
        if (collections.length === 0) {
            console.log('🔧 Colección "users" no existe, creando...');
            await mongoose.connection.db.createCollection('users');
            console.log('✅ Colección "users" creada correctamente');
        }
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
