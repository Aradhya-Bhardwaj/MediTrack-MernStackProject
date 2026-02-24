//This file is used to fix the index of the database.

require('dotenv').config();
const mongoose = require('mongoose');

const fixIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        console.log('Dropping googleId_1 index...');
        try {
            await collection.dropIndex('googleId_1');
            console.log('Successfully dropped googleId_1');
        } catch (e) {
            console.log('Index googleId_1 not found or already dropped');
        }

        // Also drop email_1 just in case, to let it be recreated fresh
        try {
            await collection.dropIndex('email_1');
            console.log('Successfully dropped email_1');
        } catch (e) {
            console.log('Index email_1 not found');
        }

        process.exit(0);
    } catch (err) {
        console.error('Fix failed:', err);
        process.exit(1);
    }
};

fixIndex();
