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
const { renderWithHeaderFooter, isLoggedIn } = require('../utils/templateUtils');

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

// Activities list page
router.get("/activities", (req, res) => {
    renderWithHeaderFooter(getPath('pages.activities'), req, res);
});

// Specific activity pages - 4 routes with specific names
router.get("/activities/activity/Espacio-publico-junto-al-lago", (req, res) => {
    renderWithHeaderFooter(path.join(getPath('public'), 'html', 'pages', 'info', 'activities', 'Espacio-publico-junto-al-lago.html'), req, res);
});

router.get("/activities/activity/Centro-de-Actividades-Acuaticas-Sostenibles", (req, res) => {
    renderWithHeaderFooter(path.join(getPath('public'), 'html', 'pages', 'info', 'activities', 'Centro-de-Actividades-Acuaticas-Sostenibles.html'), req, res);
});

router.get("/activities/activity/Jardin-Botanico-Comunitario", (req, res) => {
    renderWithHeaderFooter(path.join(getPath('public'), 'html', 'pages', 'info', 'activities', 'Jardin-Botanico-Comunitario.html'), req, res);
});

router.get("/activities/activity/Clase-de-Yoga-al-Aire-Libre", (req, res) => {
    renderWithHeaderFooter(path.join(getPath('public'), 'html', 'pages', 'info', 'activities', 'Clase-de-Yoga-al-Aire-Libre.html'), req, res);
});

// Trails list page
router.get("/trails", (req, res) => {
    renderWithHeaderFooter(getPath('pages.trails'), req, res);
});

// Specific trail pages - 4 routes with specific names
router.get("/trails/trail/Ruta-de-Senderismo-Ezmeral-Valley", (req, res) => {
    renderWithHeaderFooter(path.join(getPath('public'), 'html', 'pages', 'info', 'trails', 'Ruta-de-Senderismo-Ezmeral-Valley.html'), req, res);
});

router.get("/trails/trail/Ruta-Urbana-Peatonal-Nimble-Peak", (req, res) => {
    renderWithHeaderFooter(path.join(getPath('public'), 'html', 'pages', 'info', 'trails', 'Ruta-Urbana-Peatonal-Nimble-Peak.html'), req, res);
});

router.get("/trails/trail/Ruta-de-Observacion-de-Aves", (req, res) => {
    renderWithHeaderFooter(path.join(getPath('public'), 'html', 'pages', 'info', 'trails', 'Ruta-de-Observacion-de-Aves.html'), req, res);
});

router.get("/trails/trail/Carril-Bici-Panoramico", (req, res) => {
    renderWithHeaderFooter(path.join(getPath('public'), 'html', 'pages', 'info', 'trails', 'Carril-Bici-Panoramico.html'), req, res);
});

// Establishments list page
router.get("/establishments", (req, res) => {
    renderWithHeaderFooter(getPath('pages.establishments'), req, res);
});

// Specific establishment pages - 4 routes with specific names
router.get("/establishments/establishment/Mercado-Ecologico-Local", (req, res) => {
    renderWithHeaderFooter(path.join(getPath('public'), 'html', 'pages', 'info', 'establishments', 'Mercado-Ecologico-Local.html'), req, res);
});

router.get("/establishments/establishment/Hotel-Ecologico-GreenLake", (req, res) => {
    renderWithHeaderFooter(path.join(getPath('public'), 'html', 'pages', 'info', 'establishments', 'Hotel-Ecologico-GreenLake.html'), req, res);
});

router.get("/establishments/establishment/Tienda-de-Productos-Sostenibles", (req, res) => {
    renderWithHeaderFooter(path.join(getPath('public'), 'html', 'pages', 'info', 'establishments', 'Tienda-de-Productos-Sostenibles.html'), req, res);
});

router.get("/establishments/establishment/Cafeteria-Ecologica", (req, res) => {
    renderWithHeaderFooter(path.join(getPath('public'), 'html', 'pages', 'info', 'establishments', 'Cafeteria-Ecologica.html'), req, res);
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

router.get("/profile", (req, res) => {
    if (!isLoggedIn(req)) {
        return res.redirect('/login');
    }
    renderWithHeaderFooter(getPath('pages.profile'), req, res);
});

router.get("/my-trips", (req, res) => {
    if (!isLoggedIn(req)) {
      return res.redirect("/login");
    }
    renderWithHeaderFooter(getPath('pages.info.myTrips'), req, res);
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