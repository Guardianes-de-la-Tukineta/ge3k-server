const { Cart, Product, Category, Theme } = require("../db");
const { productFormat } = require("../utils/utils");

const getCart = async (CustomerId) => {
  const rawCart = await Cart.findAll({
    where: { CustomerId },
    attributes: ["quantity"],
    include: [
      {
        model: Product,
        include: [
          { model: Category, attributes: ["name"] },
          { model: Theme, attributes: ["name"] },
        ],
      },
    ],
  });

  const products = rawCart.map((rawProduct) => {
    const { quantity, Product } = rawProduct;
    return {
      product: productFormat(Product),
      quantity,
    };
  });

  return products;
};

const createNewCart = async (CustomerId, ProductId, quantity) => {
  const [newCart, created] = await Cart.findOrCreate({
    where: { CustomerId, ProductId },
    defaults: { quantity },
  });

  if (!created) {
    newCart.quantity = quantity;
    await newCart.save();
    return { message: "Cantidad actualizada" };
  }
  return { message: "Producto agregado al carrito" };
};

const createBulkCart = async (CustomerId, products) => {
  if (products) {
    const currentCart = await Cart.findAll({
      where: { CustomerId },
      attributes: ["id", "CustomerId", "ProductId"],
    });

    products.forEach((product) => {
      product.CustomerId = CustomerId;
      currentCart.forEach((cart) => {
        if (
          cart.ProductId === product.ProductId &&
          cart.CustomerId === CustomerId
        )
          product.id = cart.id;
      });
    });

    await Cart.bulkCreate(products, {
      updateOnDuplicate: ["quantity"],
    });
  }

  const cart = await getCart(CustomerId);

  return cart;
};

const deleteCart = async (CustomerId, ProductId) => {
  const delCart = await Cart.findOne({
    where: { CustomerId, ProductId },
  });
  await delCart.destroy();
  return delCart;
};

const deleteBulkCart = async (CustomerId) => {
  Cart.destroy({ where: { CustomerId } });
};

module.exports = {
  getCart,
  createNewCart,
  createBulkCart,
  deleteCart,
  deleteBulkCart,
};
