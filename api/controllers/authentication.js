const jwt = require('jsonwebtoken');
const userDB = require("../models/usersModel");

/**
 * Genera un token para un usuario especifico.
 */

const createToken = (data) => {
    const options = {
        expiresIn: "30m",
    };

    return jwt.sign(data, process.env.JWT_TOKEN_SECRET, options)
};
