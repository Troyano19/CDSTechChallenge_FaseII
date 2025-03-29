const express = require('express');
const router = express.Router();
const airportsController = require('../controllers/airportsController.js');
//TODO: Convertirla en ruta privada para administración
router.post('/ryanair/saveAirports', airportsController.saveAirports);
router.post('/ryanair/getAvailableFlights', airportsController.getAvailableFlights);

router.get('/ryanair/getAirportsFromCity/:city', airportsController.getAirportsFromCity);
module.exports = router;