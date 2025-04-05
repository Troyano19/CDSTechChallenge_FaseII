const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        collation: { locale: "en", strength: 2, caseLevel: false} 
    },
    name: {
        type: String,
        required: function(){ return this.registrationmethod === 'DEFAULT'; },
    },
    surnames: {
        type: String,
        required: function(){ return this.registrationmethod === 'DEFAULT'; },
    },
    email: {
        type: String,
        required: true,
        collation: { locale: "en", strength: 2 } 
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
        default: function() {
            return this.registrationmethod === 'GOOGLE';
        }
    },
    pfp: {
        type: String,
        default: '/images/default-profile.png'
    },
    registrationmethod: {
        type: String,
        enum: ["GOOGLE", "DEFAULT"],
        default: "DEFAULT" 
    },
    password: {
        type: String,
        required: function() {
            return this.registrationmethod === 'DEFAULT' && !!this.password;
        },
    },
    googleId: {
        type: String,
        default: null
    },
});

// Indexes - we keep only these and remove any index: true fields above
userSchema.index({username: 1}, {unique: true, collation: { locale: "en", strength: 2, caseLevel: false }});
userSchema.index({email: 1}, {unique: true});
userSchema.index({googleId: 1}, {unique: true, partialFilterExpression: { googleId: { $exists: true, $ne: null } }});

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
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const Users = mongoose.model("User", userSchema);

module.exports = Users;