const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    timing: String,
    startDate: Date,
    endDate: Date,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
