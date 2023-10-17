const { Favorite, Product } = require("../db");

const getAllFavorites = async (customerId) => {
  const rawFavorites = await Favorite.findAll({
    where: { CustomerId: customerId },
  });
  const favorites = rawFavorites.map((favorite) => favorite.ProductId);
  const products = await Product.findAll({ where: { id: favorites } });
  return products;
};

const createNewFavorite = async (customerId, productId) => {
  const newFavorite = await Favorite.create({ customerId, productId });
  await newFavorite.setCustomer(customerId);
  await newFavorite.setProduct(productId);
  return newFavorite;
};

const createBulkFavorite = async (CustomerId, products) => {
  if (products) {
    const currentFavorite = await Favorite.findAll({
      where: { CustomerId },
      attributes: ["id", "CustomerId", "ProductId"],
    });

    products.forEach((product) => {
      currentFavorite.forEach((prod) => {
        if (product.productId === prod.ProductId) {
          product.id = prod.id;
        }
      });
      product.CustomerId = CustomerId;
      product.ProductId = product.productId;
      delete product.productId;
    });

    await Favorite.bulkCreate(products, { ignoreDuplicates: true });
  }

  const favorite = await getAllFavorites(CustomerId);

  return favorite;
};

const deleteFavorite = async (customerId, productId) => {
  const delFavorite = await Favorite.findOne({
    where: { CustomerId: customerId, ProductId: productId },
  });
  await delFavorite.destroy();
  return delFavorite;
};

module.exports = {
  getAllFavorites,
  createNewFavorite,
  createBulkFavorite,
  deleteFavorite,
};
