const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true,
        validate: {
            validator: function(value) {
                return !value.includes('@');
            },
            message: 'El nombre de usuario no puede contener @'
        }
    },
    name: {
        type: String,
        required: true,
    },
    surname1: {
        type: String,
        required: true,
    },
    surname2: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            message: 'Por favor introduce un email válido'
        }
    },
    registerDate: {
        type: Date,
        default: Date.now(),
    },
    role: {
        type: String,
        required: true,
        enum: ["USER", "LOCAL_OWNER", "ADMIN", "TRAIL_MANAGER"],
        default: "USER",
    },
    accountActivated: {
        type: Boolean,
        default: false,
    },
    pfp: {
        type: String,
        default: '/images/default-profile.png'
    },
    registrationmethod: {
        type: String,
        enum: ["GOOGLE", "DISCORD", "DEFAULT"],
        default: "DEFAULT" 
    },
    password: {
        type: String,
        required: function() {
            return this.registrationmethod === 'DEFAULT';
        },
        validate: {
            validator: function(password) {
                // Only validate if it's a DEFAULT registration
                if (this.registrationmethod !== 'DEFAULT') return true;
                
                // At least 6 characters, 1 uppercase, 1 lowercase and 1 number
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
                return passwordRegex.test(password);
            },
            message: 'La contraseña debe tener al menos 6 caracteres, 1 mayúscula, 1 minúscula y un número'
        }
    },
    googleId: {
        type: String,
        default: null
    },
    discordId: {
        type: String,
        default: null
    }
});

// Indexes - we keep only these and remove any index: true fields above
userSchema.index({username: 1}, {unique: true});
userSchema.index({email: 1}, {unique: true});
userSchema.index({discordId: 1}, {unique: true, sparse: true});
userSchema.index({googleId: 1}, {unique: true, sparse: true});

// Hash password with SHA-256
userSchema.methods.hashPassword = function(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Compare password with stored hash
userSchema.methods.comparePassword = function(password) {
    const hashedPassword = this.hashPassword(password);
    return this.password === hashedPassword;
};

// Pre-save hook to hash password before saving
userSchema.pre('save', function(next) {
    if (this.isModified('password') && this.registrationmethod === 'DEFAULT') {
        this.password = this.hashPassword(this.password);
    }
    next();
});

const Users = mongoose.model("User", userSchema);

module.exports = Users;