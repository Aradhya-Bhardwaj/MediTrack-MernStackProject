const passport = require('passport');

//passport- Aunthentication middleware for node.js.//////// use for:-
// sessions
// login
// OAuth (Google login)
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const authorizedDoctors = require('../data/authorized_doctors.json');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5001/api/auth/google/callback',
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // Find existing user by googleId or email
        let user = await User.findOne({
            $or: [
                { googleId: profile.id },
                { email: profile.emails[0].value }
            ]
        });

        if (user) {
            // Update googleId if missing
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
            return done(null, user);
        }

        // Create new user if not found
        // Use requestedRole from session if provided
        let role = req.session.requestedRole || 'patient';
        const email = profile.emails[0].value.toLowerCase();

        // Restriction: Only authorized emails can be doctors
        if (role === 'doctor' && !authorizedDoctors.includes(email)) {
            console.log(`[AUTH] Unauthorized doctor login attempt: ${email}. Downgrading to patient.`);
            role = 'patient';
        }

        user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: email,
            role: role
        });

        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));
