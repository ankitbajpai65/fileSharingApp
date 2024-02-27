const { Router } = require('express');
const sendEmail = require('../services/emailService');
const dotenv = require('dotenv');

dotenv.config();

const router = Router();

router.post('/', (req, res) => {
    try {
        sendEmail({
            subject: "Filegem shared a file link",
            text: "Please find the button to download te file below",
            to: req.body.toEmail,
            from: req.body.fromEmail,
            html: `
            <p>Hi there,</p>
            <p>Please visit the below attached link to download the file -</p>
            <p><a href="${req.body.fileLink}">Download file</a></p>
            <p>File size - ${req.body.fileSize} bytes</p>
            <p>Thank you for using filegem.</p>
        `
        });
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;