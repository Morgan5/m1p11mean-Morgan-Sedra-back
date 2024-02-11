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

// Update
router.put('/update/:appointmentId', async (req, res) => {
    try {
      const appointmentId = req.params.appointmentId;
      const updatedData = req.body;

      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        updatedData,
        { new: true } // Pour renvoyer le document mis à jour
      );
  
      if (!updatedAppointment) {
        return res.status(404).json({ success: false, msg: 'Appointment not found' });
      }
  
      res.status(200).json({ success: true, data: updatedAppointment });
    } catch (error) {
      console.error('Error updating appointment:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Route pour supprimer un rendez-vous
router.delete('/:appointmentId', async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const deletedAppointment = await appointmentController.deleteAppointment(appointmentId);

        if (deletedAppointment === null) {
            res.status(404).json({ message: 'Appointment not found' });
        } else {
            res.status(200).json({
                message: 'Appointment deleted successfully',
                data: deletedAppointment
            });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du rendez-vous :', error.message);
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
    res.json({
        message: "Test fotsiny!"
    });
});

module.exports = router;