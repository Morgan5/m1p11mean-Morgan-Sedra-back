const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Service = require('./service');

const employeeSchema = mongoose.Schema({
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
            serviceId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Service', // Référence correcte ici
            }
        }
    ]
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;

//All employee join
module.exports.getAllEmployeeId = async function (empId) {
    try {
        const populateEmployee = await Employee.findOne({_id: empId}) 
        .populate({
            path: 'tasksCompleted',
            populate: [
                { path: 'serviceId', model: 'Service' }
            ]
        });
      return populateEmployee;
    } catch (error) {
      throw error;
    }
};
  
// Update 
module.exports.updateEmployee = async function(employeeId,updatedEmployee){
    try {
        const result = await Employee.findByIdAndUpdate(
            employeeId,
            {
                $set: updatedEmployee
            },
            { new: true } // Pour retourner le document mis à jour
        );

        if (!result) {
            throw new Error("Employee not found");
        }

        return result;
    } catch (error) {
        throw error;
    }
};

// All employee
module.exports.getAllEmployee = async function(){
    try{
        return await Employee.find();
    }catch(error){
        throw error;
    }
};


// Delete Employee
module.exports.deleteEmployee = async function(employeeId){
    try {
        return await Employee.findByIdAndDelete(employeeId);
    } catch (error) {
        throw error;
    }
};

// Find per email
module.exports.getEmployeeByEmail = async function(email){
    try{
        const query = {email: email};
        return await Employee.findOne(query);
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


// Create Tasks
module.exports.createTasksCompleted = async function(employeeId,newTasksCompleted){
    try {
        const employee = await this.findById(employeeId);
        if (!employee) {
            throw new Error("Employee not found");
        }
        if (!Array.isArray(employee.tasksCompleted)) { // Assurer que tasksCompleted est un tableau
            employee.tasksCompleted = [];
        }
        // Vérifier si une tâche avec la même date existe déjà
        const duplicateTask = employee.tasksCompleted.find(task => task.date.getTime() === newTasksCompleted.date.getTime());
        if (duplicateTask) {
            throw new Error("A task with the same date already exists");
        }
        employee.tasksCompleted.push(newTasksCompleted);
        return await employee.save();
    } catch (error) {
        throw error;
    }
};