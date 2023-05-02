const sgMail = require("@sendgrid/mail");
const sendError = require("./error");

const sendEmail = async (EmailTo, body, EmailSubject) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_KEY);

    const mailOptions = {
      to: EmailTo,
      from: `${process.env.APP_NAME} <${process.env.SENDGRID_EMAIL_FROM}>`,
      subject: EmailSubject,
      html: body,
    };

    return sgMail.send(mailOptions);
  } catch (error) {
    sendError(error.message);
  }
};
module.exports = sendEmail;
