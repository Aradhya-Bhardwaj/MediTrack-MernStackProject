//It manages hospital appointment booking.


const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {  //middleware that checks parameters 
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: 'Unauthorized' });
};

// Middleware to check role
const isRole = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) return next();
    res.status(403).json({ message: 'Forbidden' });
};

// @route   POST /api/appointments
// @desc    Book an appointment (Patient only)
router.post('/', isAuthenticated, isRole('patient'), async (req, res) => {
    try {
        const { department, doctorName, date, timeSlot } = req.body;
        const newAppointment = new Appointment({
            department,
            doctorName,
            patientName: req.user.name,
            patientId: req.user._id,
            date,
            timeSlot
        });
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/appointments
// @desc    Get all appointments (Patient sees own, Doctor sees all)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        console.log("## Hello from GET /api/appointments");
        let query = {};
        if (req.user.role === 'patient') {
            query = { patientId: req.user._id };
        }
        const appointments = await Appointment.find(query).sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment status (Doctor only)
router.put('/:id', isAuthenticated, isRole('doctor'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
