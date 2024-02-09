const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    requestedServices: [
        {
            serviceId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Service'
            },
            selectedEmployee: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Employee'
            }
        }
    ],
    appointmentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Pending', 'Cancelled'],
        default: 'Pending'
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Create 
module.exports.createAppointment = async function(appointmentData){
    try {
        const newAppointment = new Appointment(appointmentData);
        const savedAppointment = await newAppointment.save();
        return savedAppointment;
    } catch (error) {
        throw error;
    }
}

// All
module.exports.getAppointment = async function(){
    try {
        return await Appointment.find();
    } catch (error) {
        throw error;
    }
}

// Exportez le modèle ici
module.exports = Appointment;
