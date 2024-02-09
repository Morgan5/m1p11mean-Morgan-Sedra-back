const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Appointment = require('../models/appointment');

// Create appointment
router.post('/create',async (req,res)=>{
    try {
        const appointmentData = {
            clientId: req.body.clientId,
            requestedServices: req.body.requestedServices,
            appointmentDate: req.body.appointmentDate,
            status: req.body.status
        };
        const newAppointment = await Appointment.createAppointment(appointmentData);
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Error creating appointment:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Appointments
router.get('/all',async (req,res)=>{
    try {
        const appointmentData = await Appointment.getAppointment();
        res.status(201).json(appointmentData);
    } catch (error) {
        console.error('Error creating appointment:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/test',async (req,res)=>{
    res.json({message:"tay"});
});

module.exports = router;