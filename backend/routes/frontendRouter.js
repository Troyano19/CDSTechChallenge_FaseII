/**
 * Module defining the router with every endpoint for the frontend
 *
 * @module routes/frontend
 */

//We load the express module
const express = require("express");
const path = require("path");
// Import the path configuration and template utility
const { getPath } = require("../utils/pathConfig");
const {
  renderWithHeaderFooter,
  isLoggedIn,
} = require("../utils/templateUtils");

//We start the frontend router
const router = express.Router();

//Define the public directory path
const publicPath = getPath("public");

/**
 * ENDPOINT: GET /
 * HANDLER: express static
 * UTILITY: Show all content from the public/ directory
 */
router.use(express.static(publicPath));

router.get("/", (req, res) => {
  renderWithHeaderFooter(getPath("pages.home"), req, res);
});

router.get("/admin", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/");
  }
  renderWithHeaderFooter(getPath("pages.admin"), req, res);
});

// Activities list page
router.get("/activities", (req, res) => {
  renderWithHeaderFooter(getPath("pages.activities"), req, res);
});

// Specific activity pages - 4 routes with specific names
router.get(
  "/activities/activitie/Espacio-publico-junto-al-lago",
  (req, res) => {
    renderWithHeaderFooter(
      getPath("pages.info.activities.espacioPublicoLago"),
      req,
      res
    );
  }
);

router.get(
  "/activities/activitie/Centro-de-Actividades-Acuaticas-Sostenibles",
  (req, res) => {
    renderWithHeaderFooter(
      getPath("pages.info.activities.centroActividadesAcuaticas"),
      req,
      res
    );
  }
);

router.get("/activities/activitie/Jardin-Botanico-Comunitario", (req, res) => {
  renderWithHeaderFooter(
    getPath("pages.info.activities.jardinBotanico"),
    req,
    res
  );
});

router.get("/activities/activitie/Clase-de-Yoga-al-Aire-Libre", (req, res) => {
  renderWithHeaderFooter(getPath("pages.info.activities.claseYoga"), req, res);
});

// Trails list page
router.get("/trails", (req, res) => {
  renderWithHeaderFooter(getPath("pages.trails"), req, res);
});

// Specific trail pages - 4 routes with specific names
router.get("/trails/trail/Ruta-de-Senderismo-Ezmeral-Valley", (req, res) => {
  renderWithHeaderFooter(getPath("pages.info.trails.rutaSenderismo"), req, res);
});

router.get("/trails/trail/Ruta-Urbana-Peatonal-Nimble-Peak", (req, res) => {
  renderWithHeaderFooter(
    getPath("pages.info.trails.rutaUrbanaPeatonal"),
    req,
    res
  );
});

router.get("/trails/trail/Ruta-de-Observacion-de-Aves", (req, res) => {
  renderWithHeaderFooter(
    getPath("pages.info.trails.rutaObservacionAves"),
    req,
    res
  );
});

router.get("/trails/trail/Carril-Bici-Panoramico", (req, res) => {
  renderWithHeaderFooter(
    getPath("pages.info.trails.carrilBiciPanoramico"),
    req,
    res
  );
});

// Establishments list page
router.get("/establishments", (req, res) => {
  renderWithHeaderFooter(getPath("pages.establishments"), req, res);
});

// Specific establishment pages - 4 routes with specific names
router.get(
  "/establishments/establishment/Mercado-Ecologico-Local",
  (req, res) => {
    renderWithHeaderFooter(
      getPath("pages.info.establishments.mercadoEcologico"),
      req,
      res
    );
  }
);

router.get(
  "/establishments/establishment/Hotel-Ecologico-GreenLake",
  (req, res) => {
    renderWithHeaderFooter(
      getPath("pages.info.establishments.hotelEcologico"),
      req,
      res
    );
  }
);

router.get(
  "/establishments/establishment/Tienda-de-Productos-Sostenibles",
  (req, res) => {
    renderWithHeaderFooter(
      getPath("pages.info.establishments.tiendaProductos"),
      req,
      res
    );
  }
);

router.get("/establishments/establishment/Cafeteria-Ecologica", (req, res) => {
  renderWithHeaderFooter(
    getPath("pages.info.establishments.cafeteriaEcologica"),
    req,
    res
  );
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

  renderWithHeaderFooter(getPath("pages.travel"), req, res);
});

// Handle form submissions from the home page
router.post("/travel", (req, res) => {
  // Extract form data
  const origin = req.body.origin;
  const departureDate = req.body.departureDate;
  const returnDate = req.body.returnDate;

  // Redirect to the travel page with query parameters
  res.redirect(
    `/travel?origin=${encodeURIComponent(
      origin
    )}&departure=${encodeURIComponent(
      departureDate
    )}&return=${encodeURIComponent(returnDate)}`
  );
});

router.get("/login", (req, res) => {
  renderWithHeaderFooter(getPath("pages.session.login"), req, res);
});

router.get("/register", (req, res) => {
  renderWithHeaderFooter(getPath("pages.session.register"), req, res);
});

router.get("/profile", (req, res) => {
  if (!isLoggedIn(req)) {
    return res.redirect("/login");
  }
  renderWithHeaderFooter(getPath("pages.profile"), req, res);
});

router.get("/my-trips", (req, res) => {
  if (!isLoggedIn(req)) {
    return res.redirect("/login");
  }
  renderWithHeaderFooter(getPath("pages.info.myTrips"), req, res);
});

router.get("/city3D", (_, res) => {
  res.sendFile(getPath("pages.city3D"));
});

router.get("/terms", (req, res) => {
  renderWithHeaderFooter(getPath("pages.legal.terms"), req, res);
});

router.get("/privacy", (req, res) => {
  renderWithHeaderFooter(getPath("pages.legal.privacy"), req, res);
});

router.get("/cookies", (req, res) => {
  renderWithHeaderFooter(getPath("pages.legal.cookies"), req, res);
});

module.exports = router;
