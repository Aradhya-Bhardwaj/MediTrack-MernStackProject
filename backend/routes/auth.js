const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const authorizedDoctors = require('../data/authorized_doctors.json');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Restriction: Only authorized emails can be doctors
        if (role === 'doctor' && !authorizedDoctors.includes(email.toLowerCase())) {
            return res.status(403).json({ message: 'This email is not authorized for a Doctor account.' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role: role || 'patient'
        });

        await user.save();

        // Login user after registration
        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: 'Login after registration failed' });
            res.status(201).json(user);
        });
    } catch (err) {
        console.error('[AUTH ERROR]', err);
        res.status(500).json({ message: 'Server error during registration', error: err });
    }
});

// @route   POST /api/auth/login
// @desc    Login with email and password
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Login session
        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: 'Login failed' });
            res.json(user);
        });
    } catch (err) {
        console.error('[AUTH ERROR]', err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @route   GET /api/auth/google
// @desc    Authenticate with Google
router.get('/google', (req, res, next) => {
    console.log('[DEBUG] Hit /api/auth/google, role:', req.query.role);
    if (!req.session) {
        console.error('[ERROR] Session not initialized!');
        return res.status(500).json({ message: 'Session Error: req.session is undefined' });
    }
    try {
        const role = req.query.role || 'patient';
        req.session.requestedRole = role; // Store role to use after success
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            callbackURL: 'http://localhost:5001/api/auth/google/callback'
        })(req, res, next);
    } catch (err) {
        console.error('[ERROR] Passport Authenticate Crash:', err);
        res.status(500).json({ message: 'Passport Initialization Error', error: err.message });
    }
});

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
    (req, res) => {
        // Successful authentication
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
);

// @route   GET /api/auth/current_user
// @desc    Get current session user
router.get('/current_user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

// @route   GET /api/auth/logout
// @desc    Logout user
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
});

module.exports = router;
