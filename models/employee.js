const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Employee Shema
const EmployeeShema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tasksCompleted: [
        {
            date: {
                type: Date,
                required: true,
            },
            commissionAmount: {
                type: Number,
                required: true,
            },
        }
    ]
},{timestamps: true});

const Employee = module.exports = mongoose.model('Employee',EmployeeShema);

module.exports.getAllEmployee = async function(){
    try{
        return await Employee.find();
    }catch(error){
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

// Register
module.exports.createEmployee = async function(newEmployee){
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newEmployee.password, salt);

        newEmployee.password = hash;
        const saveEmployee = await newEmployee.save();
         
        return saveEmployee;
    } catch (error) {
        throw error;
    }
};

module.exports.updateEmployee = async function(employeeId,updatedEmployee){
    try {
        const employee = await this.find(employeeId);
        if(!employee){
            throw new Error("Employee not found");
        }
        employee.firstName = updatedEmployee.firstName || employee.firstName;
        employee.lastName = updatedEmployee.lastName || employee.lastName;
        employee.email = updatedEmployee.email || employee.email;
        employee.password = employee.password;
        return await employee.save();
    } catch (error) {
        throw error;
    }
};

module.exports.createTasksCompleted = async function(employeeId,newTasksCompleted){
    try {
        const employee = await this.findById(employeeId);
        if (!employee) {
            throw new Error("Employee not found");
        }

        // Assurer que tasksCompleted est un tableau
        if (!Array.isArray(employee.tasksCompleted)) {
            employee.tasksCompleted = [];
        }

        // Vérifier si une tâche avec la même date existe déjà
        const duplicateTask = employee.tasksCompleted.find(task => task.date.getTime() === newTasksCompleted.date.getTime());
        if (duplicateTask) {
            throw new Error("A task with the same date already exists");
        }

        employee.tasksCompleted.push(newTasksCompleted);

        // Sauvegarder l'employé avec les nouvelles tâches complétées
        return await employee.save();
    } catch (error) {
        throw error;
    }
};