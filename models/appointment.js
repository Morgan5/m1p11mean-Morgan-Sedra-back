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

const Appointment = module.exports = mongoose.model('Appointment', appointmentSchema);

// Join with populated
module.exports.getFullAppointment = async function(){
    try {
        const populatedAppointment = await Appointment.find()
                                    .populate('clientId')
                                    .populate({
                                        path: 'requestedServices',
                                        populate: [
                                        { path: 'serviceId', model: 'Service' },
                                        { path: 'selectedEmployee', model: 'Employee' }
                                        ]
                                    });
        return populatedAppointment;
    } catch (error) {
        throw error
    }
};

// Find Service Appointments by AppointmentId
module.exports.getAppointmentId = async function(appointmentId){
    try {
        const populatedAppointments = await Appointment.find({ _id: appointmentId })
            .populate('clientId')
            .populate({
                path: 'requestedServices',
                populate: [
                    { path: 'serviceId', model: 'Service' },
                    { path: 'selectedEmployee', model: 'Employee' }
                ]
            });
        return populatedAppointments;
    } catch (error) {
        throw error;
    }
};
// Create 
module.exports.createAppointment = async function(appointmentData){
    try {
        const newAppointment = new Appointment(appointmentData);
        const savedAppointment = await newAppointment.save();
        return savedAppointment;
    } catch (error) {
        throw error;
    }
};

// Detele
module.exports.deleteAppointment = async function(appointmentId){
    try {
        return await Appointment.findByIdAndDelete(appointmentId);
    } catch (error) {
        throw error;
    }
};

// Create new requestedServices
module.exports.createRequestedServices = async function (appointmentId, requestedServicesData) {
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (!Array.isArray(requestedServicesData)) {
            throw new Error("Invalid requestedServicesData format");
        }

        appointment.requestedServices.push(...requestedServicesData);
        const updatedAppointment = await appointment.save();
        return updatedAppointment;
    } catch (error) {
        throw error;
    }
}

// Update
module.exports.updateAppointment = async function(appointmentId, updatedData){
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            throw new Error("Appointment not found");
        }
        // Mettez à jour les champs appropriés avec les nouvelles données
        if (updatedData.clientId) {
            appointment.clientId = updatedData.clientId;
        }
        if (updatedData.requestedServices) {
            appointment.requestedServices = updatedData.requestedServices;
        }
        if (updatedData.appointmentDate) {
            appointment.appointmentDate = updatedData.appointmentDate;
        }
        if (updatedData.status) {
            appointment.status = updatedData.status;
        }
        return await appointment.save();
    } catch (error) {
        throw error;
    }
};

// All
module.exports.getAppointment = async function(){
    try {
        return await Appointment.find();
    } catch (error) {
        throw error;
    }
};

module.exports = Appointment;
