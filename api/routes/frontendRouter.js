/**
 * Module defining the router with every endpoint for the frontend
 * 
 * @module routes/frontend
 */

//We load the express module
const express = require('express');
const path = require('path');
// Import the path configuration and template utility
const { getPath } = require('../utils/pathConfig');
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

router.get("/", (_, res) => {
    renderWithHeaderFooter(getPath('pages.home'), res);
});

router.get("/admin", (req, res) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/');
    }
    renderWithHeaderFooter(getPath('pages.admin'), res);
});

router.get("/activities", (_, res) => {
    renderWithHeaderFooter(getPath('pages.activities'), res);
});

router.get("/activitys/activity/:id", (req, res) => {
    const activityId = req.params.id;
    renderWithHeaderFooter(getPath('pages.info.activity'), res);
});

router.get("/trails", (_, res) => {
    renderWithHeaderFooter(getPath('pages.trails'), res);
});

// Handle requests for detailed information pages
router.get("trails/trail/:id", (req, res) => {
    // Get the trail ID from route parameters
    const trailId = req.params.id;
    // Here you would fetch trail details from the database
    renderWithHeaderFooter(getPath('pages.info.trail'), res);
});

router.get("/establishments", (_, res) => {
    renderWithHeaderFooter(getPath('pages.establishments'), res);
});

router.get("/establishments/establishment/:id", (req, res) => {
    const establishmentId = req.params.id;
    renderWithHeaderFooter(getPath('pages.info.establishment'), res);
});

// Handle direct visits to travel page
router.get("/travel", (req, res) => {
    // Get query parameters if they exist
    const origin = req.query.origin;
    const departureDate = req.query.departure;
    const returnDate = req.query.return;
    
    // Here you would use these parameters to query a database
    // for flights, hotels, businesses, etc.
    // For now, we just render the travel page
    
    renderWithHeaderFooter(getPath('pages.travel'), res);
});

// Handle form submissions from the home page
router.post("/travel", (req, res) => {
    // Extract form data
    const origin = req.body.origin;
    const departureDate = req.body.departureDate;
    const returnDate = req.body.returnDate;
    
    // Redirect to the travel page with query parameters
    res.redirect(`/travel?origin=${encodeURIComponent(origin)}&departure=${encodeURIComponent(departureDate)}&return=${encodeURIComponent(returnDate)}`);
});

router.get("/login", (_, res) => {
    renderWithHeaderFooter(getPath('pages.session.login'), res);
});

router.get("/register", (_, res) => {
    renderWithHeaderFooter(getPath('pages.session.register'), res);
});

router.get("/city3D", (_, res) => {
    res.sendFile(getPath('pages.city3D'));
});

module.exports = router;