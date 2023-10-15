const { Order, OrderDetail } = require("../db");
const { getCustomerByEmail } = require("../controllers/customersController");
const { getCart, deleteBulkCart } = require("../controllers/cartsController");
const Stripe = require("stripe");
require("dotenv").config();
const { STRIPE_KEY } = process.env;

const stripe = new Stripe(STRIPE_KEY);

const getAllOrders = async () => {
  const orders = await Order.findAll();
  return orders;
};

const createOrderController = async (customerInfo) => {
  //Verifico que la orden de stripe esté paga:
  const { payment_status } = await stripe.checkout.sessions.retrieve(
    customerInfo.stripeOrderId
  );

  if (payment_status !== "paid") {
    throw Error("Payment error");
  }

  //* Se recibe un objeto con la información del customer {name:..., surname:..., mail:..., address:..., etc}
  let customer, newOrder;
  if (customerInfo.email) {
    //* Se obtiene la información del customer con a través del mail.
    customer = await getCustomerByEmail(customerInfo.email);
    if (customer) {
      //* Se crea una nueva order con la información del cliente y el customerId obtenido.
      newOrder = await Order.create({
        ...customerInfo,
        CustomerId: customer.id,
      });
    } else {
      throw Error("Customer not found");
    }
  } else {
    throw Error("Customer does not have email property");
  }

  //* Se obtiene la información de carrito con la consulta por customerId
  const cart = await getCart(customer.id);

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
  await deleteBulkCart(customer.id);

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

//* Se elimina una Orden mediante su ID
const deleteOrderById = async (orderId) => {
  const orderToDelete = await Order.findByPk(orderId);

  if (!orderToDelete) {
    throw new Error("Orden no encontrada");
  }

  await orderToDelete.destroy();
};

module.exports = {
  getAllOrders,
  createOrderController,
  getOrdersByCustomerIdController,
  getOrderDetailByOrderIdController,
  deleteOrderById,
};
