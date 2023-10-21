const sgMail = require("@sendgrid/mail");

require("dotenv").config();
const { SGMAIL_KEY } = process.env;

// Configuración de SendGrid con API Key
sgMail.setApiKey(SGMAIL_KEY);

const sendMailController = async (msg) => {
  const response = await sgMail.send(msg);
  return response;
};

module.exports = { sendMailController };
