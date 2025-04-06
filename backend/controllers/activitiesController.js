const activitesDB = require('../models/activityModel');

const getAllActivities = async (req, res) => {
    try {
        const activities = await activitesDB.find();
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActivityById = async (req, res) => {
    try {
        const activity = await activitesDB.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActivitiesByType = async (req, res) => {
    try {
        const activities = await activitesDB.find({ type: req.params.type });
        if (activities.length === 0) {
            return res.status(404).json({ message: 'No activities found for this type' });
        }
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActivityByName = async (req, res) => {
    try {
        const activity = await activitesDB.findOne({ name: req.params.name });
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllActivities,
    getActivityById,
    getActivitiesByType,
    getActivityByName,
};

