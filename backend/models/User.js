const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  //Used for password encryption (hashing).



// User structure (Schema)
// Security logic (password hashing)
// Custom functions (compare password)
const UserSchema = new mongoose.Schema({  //A Schema defines how user data will look in MongoDB.
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Required for local login
    googleId: { type: String, unique: true, sparse: true }, // Sparse allows multiple nulls
    role: { type: String, enum: ['patient', 'doctor'], default: 'patient' }
});

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
