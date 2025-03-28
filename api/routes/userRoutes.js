const express = require('express');
const router = express.Router();
const { updateProfile, deleteAccount, uploadProfileImage } = require('../controllers/userController');

// Profile update route
router.put('/profile', updateProfile);

// Delete account route
router.delete('/delete', deleteAccount);

// Upload profile image route
router.post('/profile/image', uploadProfileImage);

module.exports = router;
