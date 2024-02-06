const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Inscription
router.post('/register', async (req, res, next) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            contact: req.body.contact,
            role: 'Client'
        });

        const savedUser = await User.addUser(newUser);
        res.json({ success: true, msg: 'User registered', user: savedUser });
    } catch (err) {
        console.error(err);
        res.json({ success: false, msg: 'Failed to register user' });
    }
});

// Connexion
router.post('/authenticate', async (req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await User.getUserByUsername(username);

        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }

        const isMatch = await User.comparePassword(password, user.password);

        if (isMatch) {
            const token = jwt.sign(user.toJSON(), config.secret, {
                expiresIn: 604800 // 1 semaine
            });

            res.json({
                success: true,
                token: 'Bearer ' + token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    contact: user.contact,
                    role: user.role
                }
            });
        } else {
            return res.json({ success: false, msg: 'Wrong password' });
        }
    } catch (err) {
        console.error(err);
        res.json({ success: false, msg: 'Error during authentication' });
    }
});

// Profile 
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

module.exports = router;