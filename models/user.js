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

module.exports.getUserByEmail = async function(email) {
    try {
        const query = { email: email };
        return await User.findOne(query);
    } catch (error) {
        throw error;
    }
};

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

// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWMyMzI3YzQ1MjIwODJlYTM4NmZlN2MiLCJuYW1lIjoiU2VkcmEiLCJlbWFpbCI6InNlZHJhQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic2VkcmEiLCJwYXNzd29yZCI6IiQyYSQxMCRrLmtyZkczcmlyVG1FamhMUk1HZldlenEuVzdxRkVVdkFiR3RYSHNiTVhubTI0NzdSUzl4MiIsImNvbnRhY3QiOiIwMzQxMTIyMjMzIiwicm9sZSI6Ik1hbmFnZXIiLCJjcmVhdGVkQXQiOiIyMDI0LTAyLTA2VDEzOjIyOjA0Ljg4N1oiLCJ1cGRhdGVkQXQiOiIyMDI0LTAyLTA2VDEzOjIyOjA0Ljg4N1oiLCJfX3YiOjAsImlhdCI6MTcwNzg5NDY2MywiZXhwIjoxNzA3ODk0NzIzfQ.PJa1DGQheT1yM5jZonnWR7sur6SBUgMdwDW2aFUXBCs

// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNlZHJhQGdtYWlsLmNvbSIsInVzZXJJZCI6IjY1YzIzMjdjNDUyMjA4MmVhMzg2ZmU3YyIsImlhdCI6MTcwNzkwMDM0MSwiZXhwIjoxNzA4NTA1MTQxfQ.zul9fjGz533jB4Sct2gNhQmPIpN4Lzr1iHUifUQzWxk