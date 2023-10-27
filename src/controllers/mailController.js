const nodemailer = require("nodemailer");

require("dotenv").config();
const { EMAILPASS } = process.env;

const sendMailController = async (msg) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "contact.tukineta@gmail.com",
      pass: EMAILPASS,
    },
  });
  const response = await transporter.sendMail(msg);
  return response;
};

module.exports = { sendMailController };
