const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null }
}, { timestamps: true });


module.exports = mongoose.models.User || mongoose.model('User', userSchema);

