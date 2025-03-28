const express = require('express');
const router = express.Router();
const { saveAirports } = require('../controllers/airportsController');
//TODO: Convertirla en ruta privada para administración
router.post('/ryanair/saveAirports', saveAirports);

module.exports = router;