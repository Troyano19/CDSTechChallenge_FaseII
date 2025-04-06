const bussinessDB = require('../models/bussinessModel');

const getAllBussiness = async (req, res) => {
    try {
        const bussiness = await bussinessDB.find();
        res.status(200).json(bussiness);
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
};

const getBussinessById = async (req, res) => {
    try {
        const bussiness = await bussinessDB.findById(req.params.id);
        if (!bussiness) return res.status(404).json({ message: 'Bussiness not found' });
        res.status(200).json(bussiness);
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
};

const modifyBussiness = async (req, res) => {
    //TODO: Implementar la logica para modificar el negocio. Implica verificar que el usaurio es owner
}

const getAllBussinessByType = async (req, res) => {
    try {
        const bussiness = await bussinessDB.find({ type: req.params.type });
        if (!bussiness) return res.status(404).json({ message: 'Bussiness not found' });
        res.status(200).json(bussiness);
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
}

module.exports = {
    getAllBussiness,
    getBussinessById,
    modifyBussiness,
    getAllBussinessByType,
}