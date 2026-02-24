//This file is used to delete all users from the database.

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const cleanup = async () => {
    try {
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await User.deleteMany({ email: { $regex: /^diag_/ } });
        console.log(`Deleted ${result.deletedCount} diagnostic users`);

        // Also check for any users with googleId: null that might be causing issues
        const nullGoogleIdUsers = await User.find({ googleId: null });
        console.log(`Found ${nullGoogleIdUsers.length} users with googleId: null`);

        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
};

cleanup();
