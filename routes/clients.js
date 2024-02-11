const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Client = require('../models/client');

// Inscription
router.post('/register', async (req, res, next) => {
    try {
        const checkClient = await Client.findOne({email:req.body.email});
        if(checkClient){
            res.status(401).json({ success: false, msg: 'Email already in use' });
        }
        else{
            const newClient = new Client({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                contact: req.body.contact,
                role: 'Client',
                // mbola apina le attribut ambony
            });
            const savedClient = await Client.addClient(newClient);
            res.json({ success: true, msg: 'Client registered', client: savedClient });
        }
    } catch (err) {
        console.error(err);
        res.json({ success: false, msg: 'Failed to register client' });
    }
});

// Connexion
router.post('/authenticate', async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const client = await Client.getClientByEmail(email);

        if (!client) {
            return res.json({ success: false, msg: 'Client not found' });
        }

        const isMatch = await Client.comparePassword(password, client.password);

        if (isMatch) {
            const token = jwt.sign(client.toJSON(), config.secret, {
                expiresIn: 604800 // 1 semaine
            });

            res.json({
                success: true,
                token: 'Bearer ' + token,
                client: {
                    id: client._id,
                    firstName: client.firstName,
                    lastName: client.lastName,
                    email: client.email,
                    contact: client.contact
                    // mbola apina le attribut ambony
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
/*router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({client: req.user});
});*/

//All clients
router.get('/all', passport.authenticate('jwt', {session:false}),async (req, res, next) =>{
    try {
        const clientList = await Client.getAllClients();
        res.json({
            success:true,
            data:clientList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
          });
    }
}); 


module.exports = router;