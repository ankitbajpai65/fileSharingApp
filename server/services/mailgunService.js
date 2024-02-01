const Mailgun = require('mailgun.js');
const formData = require('form-data');
const dotenv = require('dotenv');

dotenv.config();

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
});

exports.sendMail = (req, res) => {
    console.log('sendMail fun runs');
    console.log(req.body);
    const { toEmail, fromEmail, subject, message } = req.body;

    mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: fromEmail,
        to: toEmail,
        subject: subject,
        text: message,
    });
};

// module.exports = sendMail;

