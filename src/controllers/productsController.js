const { Product, Category, Theme } = require('../db');
const { Op } = require('sequelize');
const { bulkCreateNewTheme } = require('./themesController');
const { bulkCreateNewCategory } = require('./categoriesController');
const { productFormat } = require('../utils/utils');

const getAllProducts = async (filterObject) => {
  const {
    categoryName,
    themeName,
    nameOrder,
    priceOrder,
    pageNumber,
    unitsPerPage,
    name,
  } = filterObject;

  let where = {};

  if (name) {
    where = {
      ...where,
      [Op.or]: [
        { name: { [Op.iLike]: `%${name}%` } },
        { description: { [Op.iLike]: `%${name}%` } },
      ],
    };
  }

  if (categoryName) {
    where = {
      ...where,
      CategoryId: (await Category.findOne({ where: { name: categoryName } }))
        .id,
    };
  }

  if (themeName) {
    where = {
      ...where,
      ThemeId: (await Theme.findOne({ where: { name: themeName } })).id,
    };
  }

  let order = [];

  if (nameOrder) {
    order = [...order, ['name', nameOrder]];
  }

  if (priceOrder) {
    order = [...order, ['price', priceOrder]];
  }

  let limit, offset;
  if (unitsPerPage) limit = unitsPerPage;
  if (pageNumber) offset = unitsPerPage * (pageNumber - 1);

  const specs = {
    include: [{ model: Category }, { model: Theme }],
    order,
    where,
    limit,
    offset,
  };

  products = await Product.findAll(specs);

  return products.map((product) => productFormat(product));
};

const createNewProduct = async (product) => {
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
  const product = await Product.findByPk(id, {
    include: [{ model: Category }, { model: Theme }],
  });
  return product ? productFormat(product) : null;
};

const deleteProductById = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  await product.destroy();
};

const updateProductById = async (id, productData) => {
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
};

const sugestProducts = async (sugest) => {
  const products = await Product.findAll({
    attributes: ['name'],
    where: { name: { [Op.iLike]: `%${sugest}%` } },
    limit: 5,
  });
  return products.map((product) => product.name);
};

module.exports = {
  getAllProducts,
  createNewProduct,
  createBulkNewProduct,
  getProductById,
  deleteProductById,
  updateProductById,
  sugestProducts,
};
