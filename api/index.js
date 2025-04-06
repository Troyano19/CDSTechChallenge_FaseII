//Used to build the app
const express = require('express');
const session = require("express-session");
//Used to enroute without exposing the dirnames
const path = require('path');
const passport = require('passport');
const MongoStore = require("connect-mongo");

//import the routers
const cookieParser = require('cookie-parser');
const frontendRouter = require('../backend/routes/frontendRouter');
const configRouter = require('../backend/routes/configRouter');
const authRouter = require('../backend/routes/authRouter');
const transportsRouter = require('../backend/routes/transportsRouter');
const userRouter = require('../backend/routes/userRouter'); // Add user router
const bussinessRouter = require('../backend/routes/bussinesRouter');
const trailsRouter = require('../backend/routes/trailRouter');
const activityRouter = require('../backend/routes/activityRouter');
//Import database connection
const connectDB = require('../backend/config/database');
//We configure the use of dotenv for variables
require('dotenv').config();
//Connect to MongoDB
connectDB();

//We inicialize the express app
const app = express();
const port = process.env.PORT || 3000;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 3600000 }
}));


require('../backend/config/passport'); 
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/api/user', userRouter); // Register user routes
app.use('/api/business', bussinessRouter);
app.use('/api/trail', trailsRouter);
app.use('/api/activity', activityRouter);

app.get('/establishments/establishment/:id', (req, res) => {
    // Se envía la plantilla dinámica para el detalle
    res.sendFile(path.join(__dirname, '../public/html/pages/info/establishments/dinamicStablishment.html'));
});

// Proxy for Ryanair API
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

// New proxy for GeoNames API
app.get('/proxy/geonames', async (req, res) => {
    try {
        // Get parameters from query string
        const { endpoint, ...params } = req.query;
        
        if (!endpoint) {
            return res.status(400).json({ error: 'Endpoint parameter is required' });
        }
        
        // Build the GeoNames URL
        let geonamesUrl = `http://api.geonames.org/${endpoint}?`;
        
        // Add all other parameters to the URL
        const queryParams = [];
        for (const [key, value] of Object.entries(params)) {
            if (value) {
                queryParams.push(`${key}=${encodeURIComponent(value)}`);
            }
        }
        
        // Always add the username
        queryParams.push('username=Joseleelsuper');
        
        geonamesUrl += queryParams.join('&');
        
        // Make the request to GeoNames
        const response = await fetch(geonamesUrl);
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: 'Error in GeoNames request',
                status: response.status,
                statusText: response.statusText
            });
        }
        
        const data = await response.json();
        res.json(data); // Return the data to the client
    } catch (error) {
        console.error('Error making request to GeoNames:', error);
        res.status(500).json({ error: 'Error making request to GeoNames' });
    }
});

app.listen(port, () => {
    console.log(`Web server listening on http://localhost:${port}`);
});

module.exports = app;