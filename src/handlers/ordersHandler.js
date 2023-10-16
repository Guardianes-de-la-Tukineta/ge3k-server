const {
  getAllOrders,
  createOrderController,
  updateOrderController,
  getOrdersByCustomerIdController,
  getOrderDetailByOrderIdController,
  deleteOrderById,
} = require("../controllers/ordersControllers");

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

const updateOrderHandler = async (req, res) => {
  const { stripeOrderId } = req.body;
  try {
    const updateOrder = await updateOrderController(stripeOrderId);
    res.status(200).json(updateOrder);
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

const deleteOrderHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteOrderById(id);
    res
      .status(200)
      .json({ message: `Orden con id ${id} eliminada exitosamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOrdersHandler,
  createOrdersHandler,
  updateOrderHandler,
  getOrdersByCustomerIdHandler,
  getOrderDetailByOrderIdHandler,
  deleteOrderHandler,
};
