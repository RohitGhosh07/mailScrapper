const imaps = require('imap-simple');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('./config');

async function scrapeEmails() {
    try {
        const connection = await imaps.connect({ imap: config.imap });
        await connection.openBox('INBOX');

        const searchCriteria = ['UNSEEN'];
        const fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'], struct: true, markSeen: false };
        const messages = await connection.search(searchCriteria, fetchOptions);

        for (const message of messages) {
            // Extract subject as title
            const subject = message.parts.find(part => part.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)').body.subject[0];
            
            // Extract body as description
            const body = message.parts.find(part => part.which === 'TEXT').body;
            const $ = cheerio.load(body);
            const description = $('body').text().trim() || 'No Description';

            // Handle attachments (if any)
            const attachments = message.parts.filter(part => part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT');

            for (const attachment of attachments) {
                const attachmentData = await connection.getPartData(message, attachment);
                const attachmentPath = path.join(__dirname, 'attachments', attachment.params.name);

                // Ensure the attachments directory exists
                fs.mkdirSync(path.dirname(attachmentPath), { recursive: true });

                // Save the attachment file
                fs.writeFileSync(attachmentPath, attachmentData, 'binary');
                console.log(`Attachment saved: ${attachment.params.name}`);
            }

            // Extract other event-related data
            const event = {
                title: subject || 'No Title',
                description: description,
                image: $('img').attr('src') || null,
                timing: $('time').text().trim() || 'No Timing',
                startDate: $('time.start').attr('datetime') || null,
                endDate: $('time.end').attr('datetime') || null,
                attachments: attachments.map(att => att.params.name) // store attachment filenames
            };

            // Log the event to the console
            console.log('Event:', event);

            // Post the event data to the Express server
            try {
                await axios.post('http://localhost:5000/api/events', event);
                console.log('Event posted successfully.');

                // Mark the message as seen after successful processing
                const uid = message.attributes.uid;
                await connection.addFlags(uid, ['\\Seen']);
            } catch (postError) {
                console.error('Error posting event:', postError);
            }
        }

        await connection.end();
    } catch (error) {
        console.error('Error fetching emails:', error);
    }
}

module.exports = scrapeEmails;
