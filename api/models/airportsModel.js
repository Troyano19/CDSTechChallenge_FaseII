const mongoose = require('mongoose');

const airportsSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    seoName: {
        type: String,
        required: true
    },
    aliases: {
        type: [String],
        default: []
    },
    base: {
        type: Boolean,
        required: true
    },
    city: {
        name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        }
    },
    region: {
        name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        }
    },
    country: {
        code: {
            type: String,
            required: true
        },
        iso3code: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        defaultAirportCode: {
            type: String,
            required: true
        },
        schengen: {
            type: Boolean,
            required: true
        }
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    timeZone: {
        type: String,
        required: true
    }
});

const Airports = mongoose.model('Airport', airportsSchema);

module.exports = Airports;