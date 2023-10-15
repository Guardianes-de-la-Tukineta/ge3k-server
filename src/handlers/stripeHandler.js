const { createSessionController } = require("../controllers/stripeController");

const createSessionHandler = async (req, res) => {
  try {
    const { customerId, base_url } = req.body;
    const session = await createSessionController(customerId, base_url);
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createSessionHandler };
