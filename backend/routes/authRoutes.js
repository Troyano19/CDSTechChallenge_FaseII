const express = require('express');
const router = express.Router();
const passport = require("passport");
const { login, register, logout, userData } = require('../controllers/authentication');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Logout route - changed from GET to POST
router.post('/logout', logout);

router.get('/user-data', userData);

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.route('/google/callback')
.get(passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }),
        function(req, res){
            // Successful authentication, redirect home.
            res.redirect('/');
        }
);

module.exports = router;
