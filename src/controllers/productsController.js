const { Product, Category, Theme } = require('../db');

//getData from 5000
const getAllProducts = async () => {
  try {
    const products = await Product.findAll({
      include: {
        model: Category,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
        model: Theme,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
    });
    return products;
  } catch (error) {
    throw error;
  }
};

const searchProductByName = async (productName) => {
  try {
    const results = await Product.findAll({
      where: {
        name: {
          [Sequelize.Op.iLike]: `%${productName}%`, //* Búsqueda inexacta (y tampoco distingue mayúsculas/minúsculas)
        },
      },
    });
    return results;
  } catch (error) {
    throw new Error('Error al buscar productos por nombre');
  }
};

module.exports = { getAllProducts, searchProductByName };