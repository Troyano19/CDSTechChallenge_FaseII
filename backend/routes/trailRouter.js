const express = require('express');
const router = express.Router();
const { getAllTrails, getTrailById, getTrailByTags } = require('../controllers/trailsController');

// Get all trails
router.get('/all', getAllTrails);
// Get trail by ID
router.get('/:id', getTrailById);
// Get trails by tags
router.get('/tags', getTrailByTags);

module.exports = router;