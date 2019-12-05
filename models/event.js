const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const eventSchema = new Schema({
    num1: {
        type: String,
        required: true
    },
    num2: {
        type: String,
        required: true
    },
    addition: {
        type: String,
        required: true
    },
    multiply: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema);