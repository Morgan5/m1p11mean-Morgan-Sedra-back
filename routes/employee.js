const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Employee = require('../models/employee');

//Register
router.post('/create', async (req, res, next) => {
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

// Route supprimer un employee
router.delete('/delete/:employeeId',async (req,res)=>{
    try {
        const employee = await Employee.deleteEmployee(req.params.employeeId);
        if(!employee){
            res.status(404).json({ message: 'Employee not found' });
        }
        else{
            res.status(200).json({
                message: 'Employee deleted successfully',
                data: employee
            });
        }
    } catch (error) {
        console.error('Error deleting employee:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route de tous les employees 
router.get('/all',async(req,res,next)=>{
    try {
        const allEmployee = await Employee.getAllEmployee();
        res.status(201).json(allEmployee); 
    } catch (error) {
        console.error('Error getting employee:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const checkIsConnected = require('./../middlewares/employeeConnected');

router.get('/testToken',checkIsConnected,async(req,res,next)=>{
    res.json({message:"Liste des employees"});
});

module.exports = router;