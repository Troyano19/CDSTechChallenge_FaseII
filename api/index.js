//Used to build the app
const express = require('express');
//Used to enroute without exposing the dirnames
const path = require('path');
//import the routers
const cookieParser = require('cookie-parser');
const frontendRouter = require('./routes/frontendRouter');
const configRouter = require('./routes/configRouter');
const authRouter = require('./routes/authRoutes');
const transportsRouter = require('./routes/transportsRoutes');
//Import database connection
const connectDB = require('./config/database');
//We configure the use of dotenv for variables
require('dotenv').config();

//Connect to MongoDB
connectDB();

//We inicialize the express app
const app = express();
const port = process.env.PORT || 3000;

// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));
//Load the middleware that analize the body of the requests
app.use(express.json());

app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

//Load the routers
app.use('/', frontendRouter);
app.use('/api/config', configRouter);
app.use('/api/auth', authRouter);
app.use('/api/transports', transportsRouter);
app.get('/proxy/ryanair', async (req, res) => {
    const ryanairUrl = req.query.url; // La URL de Ryanair se pasa como parámetro de consulta
    try {
        const response = await fetch(ryanairUrl);
        const data = await response.json();
        res.json(data); // Devuelve los datos al cliente
    } catch (error) {
        console.error('Error al hacer la solicitud a Ryanair:', error);
        res.status(500).json({ error: 'Error al hacer la solicitud a Ryanair' });
    }
});
app.listen(port, () => {
    console.log(`Web server listening on http://localhost:${port}`);
});

module.exports = app;