const jwt = require('jsonwebtoken');
const userDB = require("../models/usersModel");
const sanitizeHtml = require('sanitize-html');

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
    try {
        // Get the user ID from the JWT token in cookies
        const cookies = req.cookies;
        if (!cookies.loginCookie) {
            return res.status(401).json({ message: 'No estás autenticado' });
        }

        const token = jwt.verify(cookies.loginCookie, process.env.JWT_TOKEN_SECRET);
        const userId = token.user;

        // Find the user in the database
        const user = await userDB.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Get updated fields from request body
        const { username, email, name, surnames, currentPassword, newPassword } = req.body;

        // Validate username uniqueness if it's changed
        if (username && username !== user.username) {
            const existingUser = await userDB.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ message: 'El nombre de usuario ya está en uso' });
            }
            user.username = sanitizeHtml(username);
        }

        // Validate email uniqueness if it's changed
        if (email && email !== user.email) {
            const existingUser = await userDB.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'El email ya está en uso' });
            }
            user.email = sanitizeHtml(email.toLowerCase());
        }

        // Update name and surnames if they're provided
        if (name) user.name = sanitizeHtml(name);
        if (surnames) user.surnames = sanitizeHtml(surnames);

        // Handle password change if current and new passwords are provided
        if (currentPassword && newPassword) {
            // Verify the current password
            if (!user.comparePassword(currentPassword)) {
                return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
            }

            // Set the new password
            user.password = await user.hashPassword(newPassword);
        }

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Perfil actualizado correctamente' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: error.message || 'Error al actualizar el perfil' });
    }
};

/**
 * Delete user account
 */
const deleteAccount = async (req, res) => {
    try {
        // Get the user ID from the JWT token in cookies
        const cookies = req.cookies;
        if (!cookies.loginCookie) {
            return res.status(401).json({ message: 'No estás autenticado' });
        }

        const token = jwt.verify(cookies.loginCookie, process.env.JWT_TOKEN_SECRET);
        const userId = token.user;

        // Check password provided in the request body
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({ message: 'Se requiere contraseña para eliminar la cuenta' });
        }

        // Find the user to verify password
        const user = await userDB.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // For social login accounts, we might have a different validation
        if (user.registrationmethod === 'DEFAULT') {
            // Verify password for standard accounts
            if (!user.comparePassword(password)) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        }
        // For social accounts, we can decide to always allow deletion or have other verification

        // Delete the user account
        const result = await userDB.findByIdAndDelete(userId);
        
        // Clear the login cookie
        res.clearCookie('loginCookie', { httpOnly: true, sameSite: 'Strict' });
        
        res.status(200).json({ message: 'Cuenta eliminada correctamente' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: error.message || 'Error al eliminar la cuenta' });
    }
};

/**
 * Upload profile image
 */
const uploadProfileImage = async (req, res) => {
    try {
        // Get the user ID from the JWT token in cookies
        const cookies = req.cookies;
        if (!cookies.loginCookie) {
            return res.status(401).json({ message: 'No estás autenticado' });
        }

        const token = jwt.verify(cookies.loginCookie, process.env.JWT_TOKEN_SECRET);
        const userId = token.user;

        // Find the user
        const user = await userDB.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // In a real implementation, you would:
        // 1. Use multer middleware to handle file uploads
        // 2. Save the file to a storage location
        // 3. Update the user's profile picture path in the database
        
        // For this example, we'll just return a success response
        const imageUrl = '/images/default-profile.png'; // This would be the path to the saved image
        
        // Update user's profile picture path
        user.pfp = imageUrl;
        await user.save();
        
        res.status(200).json({ 
            message: 'Imagen de perfil actualizada correctamente',
            imageUrl: imageUrl 
        });
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ message: error.message || 'Error al subir la imagen de perfil' });
    }
};

module.exports = {
    updateProfile,
    deleteAccount,
    uploadProfileImage
};
