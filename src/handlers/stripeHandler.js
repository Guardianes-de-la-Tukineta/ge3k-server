const {
  createSessionController,
  getBillController,
} = require("../controllers/stripeController");

const createSessionHandler = async (req, res) => {
  try {
    const {
      customerId,
      base_url,
      name,
      surname,
      birthdate,
      email,
      phone,
      address,
    } = req.body;
    const session = await createSessionController(
      customerId,
      base_url,
      name,
      surname,
      birthdate,
      email,
      phone,
      address
    );
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBillHandler = async (req, res) => {
  try {
    const { stripeOrderId } = req.body;
    const urlLastBill = await getBillController(stripeOrderId);
    res.status(200).json({ url: urlLastBill });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createSessionHandler, getBillHandler };
