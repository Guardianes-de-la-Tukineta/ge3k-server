const { getAllCustomers, searchCustomerByName } = require('../controllers/customersController');

const getCustomersHandler = async (req, res) => {
  const { name } = req.query;
  try {
    const results = name
      ? await searchCustomerByName(name)
      : await getAllCustomers();
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCustomersHandler,
};
