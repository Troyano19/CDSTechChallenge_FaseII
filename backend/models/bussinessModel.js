const mongoose = require('mongoose');

const localModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type:String,
    },
    type: {
        type: String,
        enum: ["Hotel", "Restaurante/Bar", "Tienda", "Cultura"],
        required: true,
    },
    open_hours: {
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    registerDate: {
        type: Date,
        default: Date.now(),
    },
});

const Bussiness = mongoose.model('Bussiness', localModel);
module.exports = Bussiness;