const express = require('express');
const router = express.Router();
const passport = require('passport');
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
                "clef_privee",
                {
                expiresIn: 604800 // 1 semaine
            });
            res.json({
                success: true,
                message:"Connexion effectuer",
                token: token,
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

const checkIsConnected = require('./../middlewares/employeeConnected');

router.get('/all',checkIsConnected,async(req,res,next)=>{
    res.json({message:"Liste des employees"});
});

module.exports = router;