const express = require('express');
const router = express.Router();
const { getAllActivities, getActivityById, getActivitiesByType, getActivityByName } = require('../controllers/activitiesController');

router.get('/all', getAllActivities); // Get all activities
router.get('/:id', getActivityById); // Get activity by ID
router.get('/type/:type', getActivitiesByType); // Get activities by type (tags)
router.get('/name/:name', getActivityByName); // Get activity by name

module.exports = router;