const sgMail = require("@sendgrid/mail");
const error = require("./error");

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
  } catch (err) {
    throw error(err.message, err.status);
  }
};
module.exports = sendEmail;
