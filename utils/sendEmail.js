const {Resend} = require('resend');
require('dotenv').config();
const resend = new Resend(process.env.RESEND_KEY);

async function sendVerificationEmail(email, subject , message) {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: subject,
        html: message,
    });
}

module.exports = {
    sendVerificationEmail
};
