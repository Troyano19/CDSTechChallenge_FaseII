const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Aire libre", "Cultura", "Deportes", "Gastronomía", "Relax"],
        required: true,
    },
    location: {
        type: [Number],
        index: '2dsphere',
        required: true,
    },
    images: {
        banner: {
            type: String,
        },
        gallery: {
            type: [String],
        },
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    schedule: {
        monday: [{
            open: { type: String, required: true },
            close: { type: String, required: true }
        }],
        tuesday: [{
            open: { type: String, required: true },
            close: { type: String, required: true }
        }],
        wednesday: [{
            open: { type: String, required: true },
            close: { type: String, required: true }
        }],
        thursday: [{
            open: { type: String, required: true },
            close: { type: String, required: true }
        }],
        friday: [{
            open: { type: String, required: true },
            close: { type: String, required: true }
        }],
        saturday: [{
            open: { type: String, required: true },
            close: { type: String, required: true }
        }],
        sunday: [{
            open: { type: String, required: true },
            close: { type: String, required: true }
        }],
    },
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;