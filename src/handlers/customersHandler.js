const {
  getAllCustomers,
  searchCustomerByName,
  createNewCustomer,
  getCustomerById,
  deleteCustomerById,
  updateCustomerById,
  getCustomerByEmail,
  updateCustomerByEmail,
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

const getCustomerByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const customerById = await getCustomerById(id);

    return customerById
      ? res.status(200).json(customerById)
      : res.status(404).json({ message: 'Cliente no encontrado.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCustomerHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCustomerById(id);
    res.status(200).json({ message: `Cliente con id ${id} eliminado` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateCustomerHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const customerData = req.body;

    const updatedCustomer = await updateCustomerById(id, customerData);

    if (updatedCustomer) {
      res.status(200).json({
        message: `Cliente con ID ${id} actualizado exitosamente`,
      });
    } else {
      res.status(404).json({ message: 'Cliente no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getCustomerByEmailHandler = async (req, res) => {
  try {
    const { email } = req.params;
    const customer = await getCustomerByEmail(email);

    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: 'Cliente no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateCustomerByEmailHandler = async (req, res) => {
  try {
    const { email } = req.params;
    const updatedData = req.body;

    const updatedCustomer = await updateCustomerByEmail(email, updatedData);

    if (updatedCustomer) {
      res.status(200).json({
        message: `Cliente con correo electrónico ${email} actualizado exitosamente`,
      });
    } else {
      res.status(404).json({ message: 'Cliente no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCustomersHandler,
  createCustomerHandler,
  getCustomerByIdHandler,
  deleteCustomerHandler,
  updateCustomerHandler,
  getCustomerByEmailHandler,
  updateCustomerByEmailHandler,
};
