const { transporter, isConfigured } = require("../config/email");

const sendEmail = async (options) => {
  if (!isConfigured) {
    console.log("Email not configured. Mock sending email to", options.email);
    console.log("Subject:", options.subject);
    console.log("Message:", options.message);
    return { configured: false, mock: true };
  }

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  console.log("Message sent: %s", info.messageId);
  return info;
};

module.exports = { sendEmail };
