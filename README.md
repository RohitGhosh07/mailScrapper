

# 📧 Mail Scraper

Welcome to the Mail Scraper project! This tool is designed to scrape email attachments and extract text from them, whether they are images or PDFs.

## 🚀 Setup

1. **Clone the Repository**: Get your own copy of the project by cloning it.
   ```bash
   git clone https://github.com/yourusername/mailscraper.git
   ```
2. **Install Dependencies**: Navigate to the project folder and run the following command to install all required dependencies.
   ```bash
   npm install
   ```
3. **Configure Your Email**: Open `src/emailClient.js` and update it with your email configuration settings.
4. **Start the Process**: Run the following command to start the scraping process.
   ```bash
   npm start
   ```
   Alternatively, you can use `nodemon` for auto-reloading:
   ```bash
   nodemon start
   ```

## 📁 Files

- **`src/emailClient.js`**: Connects to your email account and downloads attachments. 📥
- **`src/extractText.js`**: Extracts text from image and PDF attachments. 📄🖼️
- **`src/index.js`**: Main entry point that runs the email client and text extraction scripts. 🔄
- **`attachments/`**: Directory where downloaded attachments are saved. 📂

## 🔧 Troubleshooting

If you encounter issues:
- **No attachments found**: Ensure your email configuration is correct and you have unread emails with attachments.
- **Certificate errors**: Update the `tlsOptions` in `src/emailClient.js` to bypass SSL certificate issues.
- **if nothing is available**: Send a new mail to that as restmail are scrapped already and being flaged read.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Happy scraping! 🚀

