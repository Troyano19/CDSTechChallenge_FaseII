//Used to build the app
const express = require('express');
//Used to enroute without exposing the dirnames
const path = require('path');
//import the routers
const frontend = require('./routes/frontendRouter')
//We configure the use of dotenv for variables
require('dotenv').config();

//We inicialize the express app
const app = express();
const port = process.env.PORT;
//Load the middleware that analize the body of the requests
app.use(express.json());
//Load the routers
app.use(frontend);


app.listen(port, () => {
    console.log(`Web server listening on port ${port}`);
});

module.exports = app;