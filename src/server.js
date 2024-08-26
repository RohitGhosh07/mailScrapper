const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const eventRoutes = require('./routes/eventRoutes');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
connectDB();

// Use event routes
app.use('/api/events', eventRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
