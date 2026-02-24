const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    department: { type: String, required: true },
    doctorName: { type: String, required: true },
    patientName: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
