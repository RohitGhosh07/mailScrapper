// src/extractText.js

const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');

const attachmentsPath = path.join(__dirname, '../attachments');

function extractTextFromImage(filePath) {
    return Tesseract.recognize(filePath, 'eng')
        .then(({ data: { text } }) => {
            console.log(`Text from image ${filePath}: ${text}`);
        });
}

function extractTextFromPdf(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    return pdf(dataBuffer)
        .then(data => {
            console.log(`Text from PDF ${filePath}: ${data.text}`);
        });
}

function extractText() {
    fs.readdir(attachmentsPath, (err, files) => {
        if (err) {
            console.error('Error reading attachments directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(attachmentsPath, file);
            const extname = path.extname(file).toLowerCase();

            if (extname === '.png' || extname === '.jpg' || extname === '.jpeg') {
                extractTextFromImage(filePath);
            } else if (extname === '.pdf') {
                extractTextFromPdf(filePath);
            } else {
                console.log(`Unsupported file type: ${file}`);
            }
        });
    });
}

module.exports = extractText;
