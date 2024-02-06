const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String
    },
    role: { 
        type: String,
        required: true
    }
}, {timestamps: true});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getAllUsers = async function(){
    try{
        return await User.find();
    }catch (error) {
        throw error;
    }
}

module.exports.getUserById = async function(id) {
    try {
        return await User.findById(id);
    } catch (error) {
        throw error;
    }
};

module.exports.getUserByUsername = async function(username) {
    try {
        const query = { username: username };
        return await User.findOne(query).exec();
    } catch (error) {
        throw error;
    }
}

// Inscription
module.exports.addUser = async function(newUser){
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);

        newUser.password = hash;
        const savedUser = await newUser.save();

        return savedUser;
    } catch (error) {
        throw error;
    }
};

// Connexion
module.exports.comparePassword = async function(candidatePassword, hash) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, hash);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

