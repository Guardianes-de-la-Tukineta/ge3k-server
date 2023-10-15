const { getCart } = require("./cartsController");
const Stripe = require("stripe");
require("dotenv").config();
const { STRIPE_KEY } = process.env;

const stripe = new Stripe(STRIPE_KEY);

const createSessionController = async (CustomerId, base_url) => {
  const cartProducts = await getCart(CustomerId);

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

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${base_url}/success`,
    cancel_url: `${base_url}/cancel`,
    metadata: { CustomerId },
  });

  const { id, url } = session;

  return {
    stripeOrderId: id,
    url,
  };
};

module.exports = { createSessionController };
