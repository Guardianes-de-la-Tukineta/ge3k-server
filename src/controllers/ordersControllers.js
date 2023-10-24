const { Order, OrderDetail, Product } = require("../db");
const { Op } = require("sequelize");
const { getCart, deleteBulkCart } = require("./cartsController");
const Stripe = require("stripe");
require("dotenv").config();
const { STRIPE_KEY } = process.env;
const cron = require("node-cron");

const stripe = new Stripe(STRIPE_KEY);

const getAllOrders = async () => {
  const orders = await Order.findAll({ order: [["createdAt", "DESC"]] });
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
  if (!name) {
    throw Error("Check name");
  }
  if (!surname) {
    throw Error("Check surname");
  }
  if (!birthdate) {
    throw Error("Check birthdate");
  }
  if (!email) {
    throw Error("Check email");
  }
  if (!phone) {
    throw Error("Check phone");
  }
  if (!address) {
    throw Error("Check address");
  }
  if (!status) {
    throw Error("Check status");
  }

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
      message.push(
        `${product.product.name} máximo disponible ${stock} unidades`
      );
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
  const order = await Order.findOne({ where: { stripeOrderId } });
  if (payment_status !== "paid") {
    throw Error("Error de pago");
  }
  order.status = "Approved";
  //Busco el enlace de descarga de la orden
  const { customer } = await stripe.checkout.sessions.retrieve(stripeOrderId);
  const bills = await stripe.invoices.list({ customer });
  const urlLastBill = bills.data[0].hosted_invoice_url;
  order.urlBill = urlLastBill;
  //Guardo la orden
  await order.save();
  return { message: order.status };
};

const fulfillOrderController = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (order.status === "Approved") {
    order.status = "Fulfilled";
    await order.save();
    return { message: "Orden cumplida" };
  }
  return { message: 'El estado actual de la orden debe ser "Approved"' };
};

//* Se obtienen todas las orders (mediante el customerId)
const getOrdersByCustomerIdController = async (customerId) => {
  const orders = await Order.findAll({
    where: { CustomerId: customerId },
    order: [["createdAt", "DESC"]],
  });
  return orders;
};

//* Se obtiene la orderDetail (utilizando la orderId)
const getOrderDetailByOrderIdController = async (orderId) => {
  // Búsqueda de detalles de orden en tabla OrderDetail incluyendo información de productos de tabla Products
  const rawOrderDetail = await OrderDetail.findAll({
    where: { OrderId: orderId },
    attributes: ["price", "quantity"],
    include: {
      model: Product,
      attributes: ["id", "name", "image", "description"],
    },
  });

  // Ordenamiento de resultados
  const products = rawOrderDetail.map((item) => {
    const { id, name, image, description } = item.Product;
    const { price, quantity } = item;
    const subtotal = item.price * item.quantity;
    return {
      id,
      name,
      description,
      image,
      price,
      quantity,
      subtotal,
    };
  });

  //Cálculo del costo total
  const initial = 0;
  const total = products.reduce(
    (accumulator, product) => accumulator + product.subtotal,
    initial
  );

  return { products, total };
};

//* Se elimina una Orden mediante su ID
const deleteOrderById = async (orderId) => {
  const orderToDelete = await Order.findByPk(orderId);

  if (!orderToDelete) {
    throw new Error("Orden no encontrada");
  }

  await orderToDelete.destroy();
};

cron.schedule("*/5 * * * *", async function () {
  // Ejecutará la rutina cada 5 minutos
  try {
    const orders = await Order.findAll({ where: { status: "Pending" } }); // Busca las ordenes en estado pendiente
    orders.map(async (order) => {
      if (order.stripeOrderId) {
        //Revisa el pago en Stripe de cada una
        const { payment_status } = await stripe.checkout.sessions.retrieve(
          order.stripeOrderId
        );
        if (payment_status === "paid") {
          // Si está paga aprueba la orden
          order.status = "Approved";
          //Busco el enlace de descarga de la orden
          const { customer } = await stripe.checkout.sessions.retrieve(
            order.stripeOrderId
          );
          const bills = await stripe.invoices.list({ customer });
          const urlLastBill = bills.data[0].hosted_invoice_url;
          order.urlBill = urlLastBill;
          //Guardo la orden
          await order.save();
        } else if ((Date.now() - order.createdAt) / 60000 > 60) {
          // Si no estando paga, la antigüedad de la orden es mayor a 60' la cancela
          order.status = "Cancelled";
          await order.save();
          await stripe.checkout.sessions.expire(order.stripeOrderId); // Solicita la expiración del enlace de pago en Stripe
          // Si se cancela la orden, se devuelven los productos al stock
          const orderDetail = await OrderDetail.findAll({
            where: { OrderId: order.id },
            attributes: ["ProductId", "quantity"],
          });

          orderDetail.forEach(async (item) => {
            const product = await Product.findByPk(item.ProductId);
            product.stock = product.stock + item.quantity;
            await product.save();
          });
        }
      }
    });
  } catch (error) {
    return error;
  }
});

module.exports = {
  getAllOrders,
  createOrderController,
  updateOrderController,
  fulfillOrderController,
  getOrdersByCustomerIdController,
  getOrderDetailByOrderIdController,
  deleteOrderById,
};
