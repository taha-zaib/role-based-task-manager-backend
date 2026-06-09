const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        default: 'user'
    },
    linkedToAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending' 
    }
}, { timestamps: true });

const adminSchema = new mongoose.Schema({

    adminName: {
        type: String,
        required: true,
        trim: true
    },
    adminEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        default: 'admin'
    },
    adminUsername: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9_]+$/
    },
    adminCode: {
        type: String,
        unique: true
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema)
const Admin = mongoose.model('Admin', adminSchema)

module.exports = { User, Admin }