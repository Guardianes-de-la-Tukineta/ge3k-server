const { Order, OrderDetail, Product } = require("../db");
const { Op } = require("sequelize");
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

const createOrderController = async (
  CustomerId,
  name,
  surname,
  birthdate,
  email,
  phone,
  address,
  status
) => {
  if (!name) {throw Error("Check name")}
  if (!surname) {throw Error("Check surname")}
  if (!birthdate) {throw Error("Check birthdate")}
  if (!email) {throw Error("Check email")}
  if (!phone) {throw Error("Check phone")}
  if (!address) {throw Error("Check address")}
  if (!status) {throw Error("Check status")}
    
  //* Se obtiene la información de carrito con la consulta por customerId
  const cart = await getCart(CustomerId);

  //Verify stock
  const productsId = cart.products.map((product) => product.product.id);
  const inStock = await Product.findAll({
    where: { id: { [Op.or]: productsId } },
    attributes: ["id", "name", "stock"],
  });

  let message = [],
    noStock = false;
  cart.products.forEach((product) => {
    const stock = inStock.find((prod) => prod.id === product.product.id).stock;
    if (product.quantity > stock) {
      message.push(`${product.product.name} máximo disponible ${stock} unidades`);
      noStock = true;
    }
  });
  if (noStock) {
    throw Error(message);
  }

  //Stock discount
  inStock.map((product) => {
    const discount = cart.products.find(
      (prod) => prod.product.id === product.id
    ).quantity;
    product.stock = product.stock - discount;
  });

  const updatePromises = inStock.map((product) => product.save());
  Promise.all(updatePromises)
    .then((res) => res)
    .catch((err) => {
      throw Error(err);
    });

  const newOrder = await Order.create({
    CustomerId,
    name,
    surname,
    birthdate,
    email,
    phone,
    address,
    status,
  });

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
  await deleteBulkCart(CustomerId);

  //* Se retorna la información de la nueva order
  return newOrder;
};

const updateOrderController = async (stripeOrderId) => {
  //Verifico que la orden de stripe esté paga:
  const { payment_status } = await stripe.checkout.sessions.retrieve(
    stripeOrderId
  );

  if (payment_status !== "paid") {
    throw Error("Payment error");
  }

  const order = await Order.findOne({ where: { stripeOrderId } });
  order.status = "Approved";
  order.save();
  return { message: order.status };
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
  updateOrderController,
  getOrdersByCustomerIdController,
  getOrderDetailByOrderIdController,
  deleteOrderById,
};
