
//------------------------------------Event scraping and storing in MongoDB------------------------------------
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const eventRoutes = require('./src/routes/eventRoutes');
const scrapeEmails = require('./src/scraper');
const connectDB = require('./src/db');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

const startServerAndScraping = async () => {
    try {
        await connectDB(); // Connect to MongoDB
        console.log('Connected to MongoDB');

        // Use event routes after MongoDB is connected
        app.use('/api/events', eventRoutes);

        // Start the scraping process
        await scrapeEmails();
        console.log('Scraping completed.');

        // Start the server after MongoDB connection is confirmed
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('An error occurred:', err);
        process.exit(1); // Exit the process with an error code if there's an error
    }
};

// Start the server and scraping process
startServerAndScraping();


//------------------------------Attachement downolad and scrapping--------------------------------------------


// const emailClient = require('./src/emailClient');
// const extractText = require('./src/extractText');

// // Run the email client script to download attachments
// emailClient();

// // After some delay to ensure attachments are downloaded, run the text extraction script
// setTimeout(() => {
//   extractText();
// }, 30000); // Adjust delay as needed