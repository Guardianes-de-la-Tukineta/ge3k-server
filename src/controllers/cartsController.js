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

const createNewCart = async (customerId, productId, quantity) => {
  const newCart = await Cart.create({ quantity });
  await newCart.setCustomer(customerId);
  await newCart.setProduct(productId);
  return newCart;
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

module.exports = { getCart, createNewCart, deleteCart, deleteBulkCart };
