/**
 * Module defining the router with every endpoint for the frontend
 * 
 * @module routes/frontend
 */

//We load the express module
const express = require('express');
const path = require('path');
// Import the path configuration and template utility
const { getPath, getPaths } = require('../utils/pathConfig');
const { renderWithHeaderFooter } = require('../utils/templateUtils');

//We start the frontend router
const router = express.Router();

//Define the public directory path
const publicPath = getPath('public');

/**
 * ENDPOINT: GET /
 * HANDLER: express static
 * UTILITY: Show all content from the public/ directory
 */
router.use(express.static(publicPath));

router.get("/", (req, res) => {
    renderWithHeaderFooter(getPath('pages.home'), res);
});

module.exports = router