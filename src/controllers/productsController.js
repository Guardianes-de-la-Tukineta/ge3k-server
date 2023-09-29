const { Product } = require('../db');
const { Op } = require('sequelize');

const getAllProducts = async () => {
  try {
    const products = await Product.findAll();

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
          [Op.iLike]: `%${productName}%`, //* Búsqueda inexacta (y tampoco distingue mayúsculas/minúsculas)
        },
      },
    });
    return results;
  } catch (error) {
    throw new Error('Error al buscar productos por nombre');
  }
};

const createNewProduct = async (product) => {
  try {
    const {
      name,
      price,
      image,
      description,
      stock,
      discount,
    } = product;

    const newProduct = await Product.create({
      name,
      price,
      image,
      description,
      stock,
      discount,
    });

    return newProduct;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const product = await Product.findByPk(id);
    return product ? product : null;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  getAllProducts,
  searchProductByName,
  createNewProduct,
  getProductById,
};
