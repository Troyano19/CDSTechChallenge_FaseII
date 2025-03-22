const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authentication');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Logout route
router.get('/logout', logout);

module.exports = router;
