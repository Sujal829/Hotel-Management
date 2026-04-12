const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Connection Error:', error);
    } else {
        console.log('SMTP Server is ready to take messages');
    }
});

module.exports = transporter;
