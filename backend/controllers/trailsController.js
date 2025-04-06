const routesDB  = require('../models/trailModel');

const getAllTrails = async (req, res) => {
    try {
        const trails = await routesDB.find({});
        res.status(200).json(trails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
};

const getTrailById = async (req, res) => {
    try {
        const trail = await routesDB.findById(req.params.id);
        if (!trail) {
            return res.status(404).json({ message: 'Trail not found' });
        }
        res.status(200).json(trail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
};

const getTrailByTags = async (req, res) => {
    try {
        const { tags } = req.query;
        const trails = await routesDB.find({ tags: { $in: tags.split(',') } });
        res.status(200).json(trails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
};

module.exports = {
    getAllTrails,
    getTrailById,
    getTrailByTags
};