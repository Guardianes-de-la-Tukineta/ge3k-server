const { Product, Category, Theme } = require('../db');
const { Op } = require('sequelize');
const { bulkCreateNewTheme } = require('./themesController');
const { bulkCreateNewCategory } = require('./categoriesController');
const { productFormat } = require('../utils/utils');

const getAllProducts = async () => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Theme }],
    });

    return products.map((product) => productFormat(product));
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
      include: [{ model: Category }, { model: Theme }],
    });
    return results.map((result) => productFormat(result));
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
      themeName,
    } = product;

    const newProduct = await Product.create({
      name,
      price,
      image,
      description,
      stock,
      discount,
    });

    //* acá lo que intenté hacer es que se fije si existe o no ese ID de categoría, así determina si debe o no crear una categoría nueva
    let category = null;
    if (categoryName) {
      category = await Category.findOne({ where: { name: categoryName } });
      if (!category) {
        category = await Category.create({ name: categoryName });
      }
    }

    //* IDEM a lo que intenté con categoría
    let theme = null;
    if (themeName) {
      theme = await Theme.findOne({ where: { name: themeName } });
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

const createBulkNewProduct = async (bulkData) => {
  let dbCategoriesNames = await Category.findAll();

  if (dbCategoriesNames)
    dbCategoriesNames = dbCategoriesNames.map((category) => category.name);

  let dbThemesNames = await Theme.findAll();

  if (dbThemesNames) dbThemesNames = dbThemesNames.map((theme) => theme.name);

  let newCategories = [];
  bulkData
    .map((product) => product.categoryName)
    .forEach((category) => {
      if (
        !dbCategoriesNames.includes(category) &&
        !newCategories.includes(category)
      )
        newCategories.push(category);
    });

  newCategories = newCategories.map((category) => ({ name: category }));

  let newThemes = [];
  bulkData
    .map((product) => product.themeName)
    .forEach((theme) => {
      if (!dbThemesNames.includes(theme) && !newThemes.includes(theme))
        newThemes.push(theme);
    });

  newThemes = newThemes.map((theme) => ({ name: theme }));

  await bulkCreateNewCategory(newCategories);
  await bulkCreateNewTheme(newThemes);

  const dbCategories = await Category.findAll();
  const dbThemes = await Theme.findAll();

  const data = bulkData.map((product) => {
    const {
      name,
      price,
      image,
      description,
      discount,
      stock,
      categoryName,
      themeName,
    } = product;

    const CategoryId = dbCategories.find(
      (category) => category.name === categoryName
    ).id;
    const ThemeId = dbThemes.find((theme) => theme.name === themeName).id;

    return {
      name,
      price,
      image,
      description,
      discount,
      stock,
      CategoryId,
      ThemeId,
    };
  });

  await Product.bulkCreate(data);
};

const getProductById = async (id) => {
  try {
    const product = await Product.findByPk(id, {
      include: [{ model: Category }, { model: Theme }],
    });
    return product ? productFormat(product) : null;
  } catch (error) {
    throw error;
  }
};

const deleteProductById = async (id) => {
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    await product.destroy();
  } catch (error) {
    throw error;
  }
};

const updateProductById = async (id, productData) => {
  try {
    const { name, price, image, description, stock, discount } = productData;

    const product = await Product.findByPk(id);

    if (!product) {
      return null; //* Esto es por si no puede encotnrar el producto
    }

    //* Acá lo que hago es que actualice ÚNICAMENTE los campos que le paso
    if (name) {
      product.name = name;
    }
    if (price) {
      product.price = price;
    }
    if (image) {
      product.image = image;
    }
    if (description) {
      product.description = description;
    }
    if (stock) {
      product.stock = stock;
    }
    if (discount !== undefined) {
      product.discount = discount;
    }

    await product.save();

    return product;
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
  deleteProductById,
  updateProductById,
};
