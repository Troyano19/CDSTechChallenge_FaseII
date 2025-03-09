const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
        //TODO: Add a default pfp
    },
    registrationmethod: {
        type: String,
        enum: ["GOOGLE","DEFAULT"],
        default: "DEFAULT" 
    },
    password: {
        type: String,
    },
    //? Should we add the organiced travels?
});

userSchema.index({discordID: 1}, {unique: true, sparse: true});

//Cypher password
userSchema.methods.hashPass = async function (password) {
    return bcrypt.hashSync(password, 15);
};

userSchema.method.compareHash = async function (password) {
    return bcrypt.compareSync(password, this.password);
};

const Users = mongoose.model("Users", userSchema);

module.exports = Users;