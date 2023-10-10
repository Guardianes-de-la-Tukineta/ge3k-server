const {
  getAllOrders,
  createOrderController,
  getOrdersByCustomerIdController,
  getOrderDetailByOrderIdController,
} = require('../controllers/ordersControllers');

const getOrdersHandler = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createOrdersHandler = async (req, res) => {
  try {
    const customer = req.body;
    const orderDetail = await createOrderController(customer);
    res.status(200).json(orderDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrdersByCustomerIdHandler = async (req, res) => {
  try {
    const { customerId } = req.params; //* El customerId se obtiene de los parámetros de la URL
    const orders = await getOrdersByCustomerIdController(customerId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrderDetailByOrderIdHandler = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderDetail = await getOrderDetailByOrderIdController(orderId);
    res.status(200).json(orderDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getOrdersHandler,
  createOrdersHandler,
  getOrdersByCustomerIdHandler,
  getOrderDetailByOrderIdHandler,
};
