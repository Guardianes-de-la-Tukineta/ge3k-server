const { Order, OrderDetail } = require('../db');
const { getCustomerByEmail } = require('../controllers/customersController');
const { getCart, deleteBulkCart } = require('../controllers/cartsController');

const getAllOrders = async () => {
  const orders = await Order.findAll();
  return orders;
};

const createOrderController = async (customer) => {
  //* Se recibe un objeto con la información del customer {name:..., surname:..., mail:..., address:..., etc}

  //* Se obtiene la información del customer con a través del mail.
  const customerId = (await getCustomerByEmail(customer.email)).id;

  //* Se crea una nueva order con la información del cliente y el customerId obtenido.
  const newOrder = await Order.create({ ...customer, CustomerId: customerId });

  //* Se obtiene la información de carrito con la consulta por customerId
  const cart = await getCart(customerId);

  //* Ahora se procesa el array de productos para crear el orderDetail
  const NewOrderDetail = cart.products.map((item) => {
    item.OrderId = newOrder.id;
    item.ProductId = item.product.id;
    item.price = item.product.price * (1 - item.product.discount / 100);
    delete item.product;
    return item;
  });

  //* Acá se crean los registros de orderDetail en bulk
  await OrderDetail.bulkCreate(NewOrderDetail);

  //* Vaciamos el carrito del usuario
  await deleteBulkCart(customerId);

  //* Se retorna la información de la nueva order
  return { newOrder };
};

//* Se obtienen todas las orders (mediante el customerId)
const getOrdersByCustomerIdController = async (customerId) => {
  const orders = await Order.findAll({ where: { CustomerId: customerId } });
  return orders;
};

//* Se obtiene la orderDetail (utilizando la orderId)
const getOrderDetailByOrderIdController = async (orderId) => {
  const orderDetail = await OrderDetail.findAll({
    where: { OrderId: orderId },
  });
  return orderDetail;
};

module.exports = {
  getAllOrders,
  createOrderController,
  getOrdersByCustomerIdController,
  getOrderDetailByOrderIdController,
};
