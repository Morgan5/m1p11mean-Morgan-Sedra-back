const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Employee = require('../models/employee');

router.post('/register', async (req, res, next) => {
    try {
        const checkEmployee = await Employee.findOne({ email: req.body.email });
        if (checkEmployee) {
            return res.status(401).json({ success: false, msg: 'Email already in use' });
        }
        const { firstName, lastName, email, password } = req.body;
        const newEmployee = new Employee({
            firstName,
            lastName,
            email,
            password,
        });
        const createdEmployee = await Employee.createEmployee(newEmployee);
        res.status(201).json(createdEmployee);
    } catch (error) {
        console.error('Error creating employee:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Route for creating new completed tasks
router.post('/tasksCompleted/:employeeId', async (req, res) => {
    try {
        const employeeId = req.params.employeeId;

        // Assurez-vous de convertir la chaîne de date en objet Date
        const newTasksCompleted = {
            date: new Date(req.body.date), // Convertir la chaîne de date en objet Date
            commissionAmount: req.body.commissionAmount,
        };

        // Appeler la fonction createTasksCompleted du modèle pour ajouter les tâches complétées
        const updatedEmployee = await Employee.createTasksCompleted(employeeId, newTasksCompleted);

        // Renvoyer la réponse JSON avec l'employé mis à jour
        res.status(201).json(updatedEmployee);
    } catch (error) {
        console.error('Error creating tasks completed:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;