const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
// Inscription
router.post('/register', async (req, res, next) => {
    try {
        const checkUser = await User.findOne({email:req.body.email});
        if(checkUser){
            res.status(401).json({ success: false, msg: 'Email already in use' });
        }
        else{
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                contact: req.body.contact,
                role: 'Manager'
            });
            const savedUser = await User.addUser(newUser);
            res.json({ success: true, msg: 'User registered', user: savedUser });
        }
    } catch (err) {
        console.error(err);
        res.json({ success: false, msg: 'Failed to register user' });
    }
});

// Connexion
router.post('/authenticate', async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.getUserByEmail(email);

        if (!user) {
            return res.json({ message: 'User not found' });
        }

        const isMatch = await User.comparePassword(password, user.password);

        if (isMatch) {
            const token = jwt.sign(
                user.toJSON(),
                config.secret,{
                expiresIn: 604800 // 1 semaine
            });
            res.json({
                success: true,
                message:"Connexion effectuer",
                token: 'Bearer ' + token,
                user: user
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

const checkIsConnected = require('./../middlewares/userConnected');
//All users
router.get('/all', checkIsConnected,async (req, res, next) =>{
    try {
        const userList = await User.getAllUsers();
        res.json({
            success:true,
            data:userList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
          });
    }
}); 


module.exports = router;