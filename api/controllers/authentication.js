const jwt = require('jsonwebtoken');
const Users = require("../models/usersModel");

/**
 * Genera un token JWT para un usuario específico.
 */
const createToken = (user) => {
    const data = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    };
    
    const options = {
        expiresIn: "30m",
    };

    return jwt.sign(data, process.env.JWT_TOKEN_SECRET, options);
};

/**
 * Registra un nuevo usuario
 */
const register = async (req, res) => {
    try {
        const { name, surnames, username, email, password, confirmPassword } = req.body;
        
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }
        
        // Split surnames - first word is surname1, rest is surname2
        const trimmedSurnames = surnames.trim();
        let surname1, surname2;
        
        if (trimmedSurnames.includes(' ')) {
            const firstSpaceIndex = trimmedSurnames.indexOf(' ');
            surname1 = trimmedSurnames.substring(0, firstSpaceIndex);
            surname2 = trimmedSurnames.substring(firstSpaceIndex + 1);
        } else {
            surname1 = trimmedSurnames;
            surname2 = ''; // If there's only one surname, leave surname2 empty
        }
        
        // Create new user
        const newUser = new Users({
            name,
            surname1,
            surname2,
            username,
            email,
            password,
            accountActivated: true // Automatically activate account for now
        });
        
        // Save user to database
        await newUser.save();
        
        // Generate JWT token
        const token = createToken(newUser);
        
        // Set token as HTTP-only cookie
        res.cookie('token', token, { 
            httpOnly: true, 
            maxAge: 30 * 60 * 1000 // 30 minutes
        });
        
        return res.status(200).json({ 
            message: 'Usuario registrado correctamente',
            user: {
                id: newUser._id,
                username: newUser.username,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        // Handle specific validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors[0] });
        }
        
        // Handle duplicate key errors (username or email already exists)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const message = field === 'email' ? 
                'Este email ya está registrado' : 
                'Este nombre de usuario ya está en uso';
            return res.status(400).json({ message });
        }
        
        console.error('Error en registro:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

/**
 * Inicia sesión con un usuario existente
 */
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        
        // Check if identifier is email or username
        const isEmail = identifier.includes('@');
        
        // Find user by email or username
        const query = isEmail ? { email: identifier } : { username: identifier };
        const user = await Users.findOne(query);
        
        // If no user is found or password doesn't match, return generic error
        if (!user || !user.comparePassword(password)) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        
        // Generate JWT token
        const token = createToken(user);
        
        // Set token as HTTP-only cookie
        res.cookie('token', token, { 
            httpOnly: true, 
            maxAge: 30 * 60 * 1000 // 30 minutes
        });
        
        return res.status(200).json({ 
            message: 'Inicio de sesión exitoso',
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

/**
 * Cierra la sesión del usuario
 */
const logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

module.exports = {
    register,
    login,
    logout,
    createToken
};
