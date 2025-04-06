const mongoose = require('mongoose');

const trailModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum:  ["Newby", "Easy", "Medium", "Hard" ],
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
    tags: {
        type: [String],
        enum: ["Mountain", "Beach", "City", "Forest", "Desert", "Jungle", "Tundra", "family", "climb", "bike", "walk", "run"],
    },
    description: {
        type: String,
    },
    location:{
        start: {
            type: [Number],
            index: '2dsphere',
            required: true,
        },
        end: {
            type: [Number],
            index: '2dsphere',
            required: true,
        },
    }
});

const Trail = mongoose.model('Trail', trailModel);
module.exports = Trail;
