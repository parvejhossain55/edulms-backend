const sgMail = require('@sendgrid/mail');

const sendEmail = async (EmailTo, body, EmailSubject) => {
    sgMail.setApiKey(process.env.SENDGRID_KEY);
    // const fromEmail =
    const mailOptions = {
        to: EmailTo,
        from: `${process.env.APP_NAME} <${process.env.SENDGRID_EMAIL_FROM}>`,
        subject: EmailSubject,
        html: body
    }

    return sgMail.send(mailOptions);

}
module.exports = sendEmail;
