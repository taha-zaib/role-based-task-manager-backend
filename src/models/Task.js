const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    completed: {
        type: Boolean,
        default: false
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)