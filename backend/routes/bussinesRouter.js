const express = require('express');
const router = express.Router();
const bussinessController = require('../controllers/bussinessController.js');

router.get("/all", bussinessController.getAllBussiness);
router.get("/:id", bussinessController.getBussinessById);
router.get("/all/:type", bussinessController.getAllBussinessByType);

router.put("/:id", bussinessController.modifyBussiness);

module.exports = router;
