const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

/* CLIENT
{
    "_id": ObjectId("client1"),
    "firstName": "Alice",
    "lastName": "Dupont",
    "email": "alice.dupont@example.com",
    "password": "hashedPassword",
    "contact": "0341234567",
    "appointmentHistory": [
      {
        "appointmentId": ObjectId("appointment1"),
        "appointmentDate": ISODate("2024-02-06T10:00:00Z"),
        "status": "Confirmed"
      }
    ],
    "preferences": {
      "preferredService": ObjectId("service1"),
      "preferredEmployee": ObjectId("employee1")
    },
    "authorizedSpecialOffers": [
      ObjectId("specialOffer1")
    ]
  }*/
  
// Client Schema
const ClientSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    appointmentHistory: {
        type: String // mbola ovaina
    },
    preferences: {
        type: String // mbola ovaina
    },
    authorizedSpecialOffers: {
        type: String // mbola ovaina
    }

}, {timestamps: true});

const Client = module.exports = mongoose.model('Client', ClientSchema);

module.exports.getAllClients = async function(){
    try{
        return await Client.find();
    }catch (error) {
        throw error;
    }
}

module.exports.getClientById = async function(id) {
    try {
        return await Client.findById(id);
    } catch (error) {
        throw error;
    }
};

module.exports.getClientByEmail = async function(email) {
    try {
        const query = { email: email };
        return await Client.findOne(query).exec();
    } catch (error) {
        throw error;
    }
}

// Delete client
module.exports.deleteClient = async function(clientId){
    try {
        return await Client.findByIdAndDelete(clientId);
    } catch (error) {
        throw error;
    }
}

// Update
module.exports.updateClient = async function(clientId, updateClient) {
    try {
        const result = await Client.findByIdAndUpdate(
            clientId,
            updateClient,
            { new: true }
        );
        if (!result) {
            throw new Error("Client not found");
        }
        return result;
    } catch (error) {
        throw error;
    }
}


// Inscription
module.exports.addClient = async function(newClient){
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newClient.password, salt);

        newClient.password = hash;
        const saveClient = await newClient.save();

        return saveClient;
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

