const { Product, Order } = require("../db");
const { Op } = require("sequelize");
const { getCart, deleteBulkCart } = require("./cartsController");
const { createOrderController } = require("./ordersControllers");
const Stripe = require("stripe");
require("dotenv").config();
const { STRIPE_KEY } = process.env;

const stripe = new Stripe(STRIPE_KEY);

const createSessionController = async (
  CustomerId,
  base_url,
  name,
  surname,
  birthdate,
  email,
  phone,
  address
) => {
  const cartProducts = await getCart(CustomerId);

  //Create order, verify and discount stock, create orderDetail and empty customer cart and
  const newOrder = await createOrderController(
    CustomerId,
    name,
    surname,
    birthdate,
    email,
    phone,
    address,
    (status = "Pending")
  );

  //Create stripe format products list
  const line_items = cartProducts.products.map((product) => {
    const { id, name, price, image, stock, discount } = product.product;
    const { quantity } = product;
    const unit_amount = Math.round(price * (discount ? 100 - discount : 100));
    return {
      price_data: {
        product_data: {
          name,
          images: [image],
          metadata: { id },
        },
        currency: "usd",
        unit_amount,
      },
      quantity,
    };
  });

  // Create session
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${base_url}/success`,
    cancel_url: `${base_url}/cancel`,
    metadata: { CustomerId },
  });

  const { id, url } = session;

  newOrder.stripeOrderId = id;
  await newOrder.save();

  return {
    stripeOrderId: id,
    url,
  };
};

module.exports = { createSessionController };
