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

router.get("/", (req, res) => {
    renderWithHeaderFooter(getPath('pages.home'), req, res);
});

router.get("/admin", (req, res) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/');
    }
    renderWithHeaderFooter(getPath('pages.admin'), req, res);
});

router.get("/activities", (req, res) => {
    renderWithHeaderFooter(getPath('pages.activities'), req, res);
});

router.get("/activitys/activity/:id", (req, res) => {
    const activityId = req.params.id;
    renderWithHeaderFooter(getPath('pages.info.activity'), req, res);
});

router.get("/trails", (req, res) => {
    renderWithHeaderFooter(getPath('pages.trails'), req, res);
});

// Handle requests for detailed information pages
router.get("trails/trail/:id", (req, res) => {
    // Get the trail ID from route parameters
    const trailId = req.params.id;
    // Here you would fetch trail details from the database
    renderWithHeaderFooter(getPath('pages.info.trail'), req, res);
});

router.get("/establishments", (req, res) => {
    renderWithHeaderFooter(getPath('pages.establishments'), req, res);
});

router.get("/establishments/establishment/:id", (req, res) => {
    const establishmentId = req.params.id;
    renderWithHeaderFooter(getPath('pages.info.establishment'), req, res);
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
    
    renderWithHeaderFooter(getPath('pages.travel'), req, res);
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

router.get("/login", (req, res) => {
    renderWithHeaderFooter(getPath('pages.session.login'), req, res);
});

router.get("/register", (req, res) => {
    renderWithHeaderFooter(getPath('pages.session.register'), req, res);
});

router.get("/city3D", (_, res) => {
    res.sendFile(getPath('pages.city3D'));
});

router.get("/terms", (req, res) => {
    renderWithHeaderFooter(getPath('pages.legal.terms'), req, res);
});

router.get("/privacy", (req, res) => {
    renderWithHeaderFooter(getPath('pages.legal.privacy'), req, res);
});

router.get("/cookies", (req, res) => {
    renderWithHeaderFooter(getPath('pages.legal.cookies'), req, res);
});

module.exports = router;