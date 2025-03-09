/**
 * Module defining the router with every endpoint for the frontend
 * 
 * @module routes/frontend
 */

//We load the express module
const express = require('express');
const path = require('path');
//Define the public directory path
const publicPath = path.join(__dirname, '../../public/');

//We start the frontend router
const router = express.Router();
/**
 * ENDPOINT: GET /
 * HANDLER: express static
 * UTILITY: Show all content from the public/ directory
 */
router.use(express.static(publicPath));

router.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "home.html"));
});

module.exports = router