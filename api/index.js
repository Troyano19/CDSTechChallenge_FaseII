//Used to build the app
const express = require('express');
//Used to enroute without exposing the dirnames
const path = require('path');
//import the routers
const frontendRouter = require('./routes/frontendRouter');
const configRouter = require('./routes/configRouter');
const authRouter = require('./routes/authRoutes');
//Import database connection
const connectDB = require('./config/database');
//We configure the use of dotenv for variables
require('dotenv').config();

//Connect to MongoDB
await connectDB();

//We inicialize the express app
const app = express();
const port = process.env.PORT || 3000;

// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));
//Load the middleware that analize the body of the requests
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

//Load the routers
app.use('/', frontendRouter);
app.use('/api/config', configRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
    console.log(`Web server listening on http://localhost:${port}`);
});

module.exports = app;