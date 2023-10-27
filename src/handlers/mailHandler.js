const { sendMailController } = require("../controllers/mailController");

const sendMailHandler = async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    if (to && subject && html) {
      const response = await sendMailController({
        from: "contact.tukineta@gmail.com",
        to,
        subject,
        html,
      });
      res.status(200).json(response);
    } else {
      throw Error("Información incorrecta");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { sendMailHandler };
