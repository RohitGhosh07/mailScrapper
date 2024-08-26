const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

// Route to save event data
router.post('/', async (req, res) => {
    const { image, title, description, timing, startDate, endDate } = req.body;

    try {
        const event = new Event({
            image,
            title,
            description,
            timing,
            startDate,
            endDate
        });

        await event.save();
        res.status(201).json({ message: 'Event saved successfully', event });
    } catch (error) {
        console.error('Error saving event to MongoDB:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to get all events
router.get('/', async (req, res) => {
    try {
        // Sort events by createdAt field in descending order to get the latest events first
        const events = await Event.find().sort({ createdAt: -1 }); // assuming createdAt is the field storing the event creation date
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events from MongoDB:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});


module.exports = router;
