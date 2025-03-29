const express = require('express');
const router = express.Router();
const { login, register, logout, userData } = require('../controllers/authentication');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Logout route - changed from GET to POST
router.post('/logout', logout);

router.get('/user-data', userData);

module.exports = router;
