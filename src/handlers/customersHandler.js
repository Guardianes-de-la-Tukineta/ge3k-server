const {
  getAllCustomers,
  searchCustomerByName,
  createNewCustomer
} = require('../controllers/customersController');

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

const createCustomerHandler = async (req, res) => {
  try {
    const customerData = req.body;

    const newCustomer = await createNewCustomer(customerData);

    return res.status(201).json({
      message: 'Cliente creado exitosamente',
      customerId: newCustomer.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCustomersHandler,
  createCustomerHandler,
};
