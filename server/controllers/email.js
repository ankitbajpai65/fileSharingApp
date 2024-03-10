const sendEmail = require('../services/emailService');
const dotenv = require('dotenv');

dotenv.config();

const SIZE_UNITS = ['bytes', 'KB', 'MB', 'GB', 'TB'];

const handleSendEmail = (req, res) => {
    let fileSize = req.body.fileSize;
    let count = 0;

    while (fileSize >= 1024 && count < SIZE_UNITS.length - 1) {
        fileSize /= 1024;
        count++;
    }

    const formattedFileSize = `${fileSize.toFixed(2)} ${SIZE_UNITS[count]}`;

    try {
        sendEmail({
            subject: `${req.body.user} shared a file link with you`,
            text: "Please find the button to download te file below",
            to: req.body.toEmail,
            from: req.body.fromEmail,
            html: `
            <p>Hi there,</p>
            <p>Please visit the below attached link to download the file -</p>
            <p><a href="${req.body.fileLink}">Download file</a></p>
            <p>File size - ${formattedFileSize}</p>
            <p>Thank you for using filegem.</p>
        `
        });
    } catch (error) {
        console.log(error)
    }
};

module.exports = handleSendEmail;