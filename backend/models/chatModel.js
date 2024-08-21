const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // It is good practice to require these fields to ensure the integrity of the data
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Corrected spelling for timestamps

module.exports = mongoose.model('Chat', chatSchema); // Capitalized model name
