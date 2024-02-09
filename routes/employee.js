const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Employee = require('../models/employee');

//Register
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

//Login
router.post('/authenticate',async (req,res,next)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const employee = await Employee.getEmployeeByEmail(email);

        if(!employee){
            return res.json({ success: false, msg: 'User not found' });
        }

        const isMatch = await Employee.comparePassword(password, employee.password);
        if(isMatch){
            const token = jwt.sign(
                {
                    email: employee.email,
                    employeeId: employee._id.toString()
                },
                config.secret,
                {
                expiresIn: 604800 // 1 semaine
            });
            res.json({
                success: true,
                message:"Connexion effectuer",
                token: 'Bearer ' + token,
                employee: employee
            });
        }else{
            return res.json({ success: false, msg: 'Wrong password' });
        }
    } catch (error) {
        
    }
});


// Route for creating new completed tasks
router.post('/tasksCompleted/:employeeId', async (req, res) => {
    try {
        const employeeId = req.params.employeeId;

        const newTasksCompleted = {
            date: new Date(req.body.date), // Convertir la chaîne de date en objet Date
            commissionAmount: req.body.commissionAmount,
        };

        const updatedEmployee = await Employee.createTasksCompleted(employeeId, newTasksCompleted);

        res.status(201).json(updatedEmployee);
    } catch (error) {
        console.error('Error creating tasks completed:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route pour créer de nouveaux services demandés pour un rendez-vous
router.post('/requestedServices/:appointmentId', async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const requestedServicesData = req.body.requestedServices;

        const updatedAppointment = await appointmentController.createRequestedServices(appointmentId, requestedServicesData);

        res.status(200).json({
            message: 'New requested services added successfully',
            data: updatedAppointment
        });
    } catch (error) {
        console.error('Error creating new requested services:', error.message);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

const checkIsConnected = require('./../middlewares/employeeConnected');

router.get('/all',checkIsConnected,async(req,res,next)=>{
    res.json({message:"Liste des employees"});
});

module.exports = router;