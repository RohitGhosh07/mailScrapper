const Imap = require('imap');
const fs = require('fs');
const path = require('path');
const { simpleParser } = require('mailparser');

const imap = new Imap({
    user: 'rohitlone07@gmail.com',
    password: 'pyhm rzzh upaj uozf',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false // Ignore SSL certificate errors
    }
});

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

function emailClient() {
    imap.once('ready', function () {
        openInbox(function (err, box) {
            if (err) {
                console.error('Error opening inbox:', err);
                return;
            }

            // Search for unseen emails received since a specific date
            imap.search(['UNSEEN', ['SINCE', 'August 25, 2024']], function (err, results) {
                if (err) {
                    console.error('Error searching emails:', err);
                    imap.end();
                    return;
                }

                if (results.length === 0) {
                    console.log('No new emails to fetch.');
                    imap.end();
                    return;
                }

                const f = imap.fetch(results, { bodies: '' });

                f.on('message', function (msg, seqno) {
                    msg.on('body', function (stream, info) {
                        simpleParser(stream, async (err, parsed) => {
                            if (err) {
                                console.error('Error parsing email:', err);
                                return;
                            }

                            if (parsed.attachments.length > 0) {
                                for (const attachment of parsed.attachments) {
                                    const filePath = path.join(__dirname, '../attachments', attachment.filename);
                                    fs.writeFileSync(filePath, attachment.content);
                                    console.log(`Saved attachment to ${filePath}`);
                                }
                            }
                        });
                    });
                });

                f.once('end', function () {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            });
        });
    });

    imap.once('error', function (err) {
        console.error('IMAP error:', err);
    });

    imap.once('end', function () {
        console.log('Connection ended');
    });

    imap.connect();
}

module.exports = emailClient;
