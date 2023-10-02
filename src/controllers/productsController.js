const { Product, Category,Theme } = require('../db');
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
      categoryName,
      themeName
    } = product;

    const newProduct = await Product.create({
      name,
      price,
      image,
      description,
      stock,
      discount
    });

    //* acá lo que intenté hacer es que se fije si existe o no ese ID de categoría, así determina si debe o no crear una categoría nueva
    let category = null;
    if (categoryName) {
      category = await Category.findOne({where:{name:categoryName}});
      if (!category) {
        category = await Category.create({ name: categoryName });
      }
    }
    
    //* IDEM a lo que intenté con categoría
    let theme = null;
    if (themeName) {
      theme = await Theme.findOne({where:{name:themeName}});
      if (!theme) {
        theme = await Theme.create({ name: themeName });
      }
    }

    //* y acá es cuando asocio, al nuevo producto, con la categoría/temática correspondiente
    if (category) {
      await newProduct.setCategory(category.id);
    }

    if (theme) {
      await newProduct.setTheme(theme.id);
    }

    return newProduct;
  } catch (error) {
    throw error;
  }
};

const createBulkNewProduct = async () => {}

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
  createBulkNewProduct,
  getProductById,
};
