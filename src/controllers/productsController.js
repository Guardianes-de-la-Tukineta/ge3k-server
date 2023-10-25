const { Product, Category, Theme, OrderDetail, Rating, Customer } = require('../db');
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
    type,
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

  let paranoid = true;
  if (type === 'hard') {
    paranoid = false;
  }

  const specs = {
    include: [{ model: Category }, { model: Theme }],
    order,
    where,
    paranoid,
  };

  let products = await Product.findAll(specs);

  if (pageNumber && unitsPerPage) {
    const totalPages = Math.ceil(products.length / unitsPerPage);
    products = products.slice(
      (pageNumber - 1) * unitsPerPage,
      pageNumber * unitsPerPage
    );
    return {
      totalPages,
      products: products.map((product) => productFormat(product)),
    };
  }
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

  if (discount < 0 || discount > 100) {
    throw new Error('El descuento debe estar entre 0% y 100%.');
  }

  if (stock < 0) {
    throw new Error('El stock no puede ser negativo.');
  }

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
    include: [
      { model: Category },
      { model: Theme },
      { model: Rating, include: Customer},
    ],
  });
  return product;
};

const deleteProductById = async (id, type) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  let force = false;
  if (type === 'hard') {
    const bought = await OrderDetail.findOne({ where: { ProductId: id } });
    if (!bought) force = true;
  }
  await product.destroy({ force });
  return product;
};

const updateProductById = async (id, productData) => {
  const { name, price, image, description, stock, discount } = productData;

  const product = await Product.findByPk(id);

  if (!product) {
    return null; //* Esto es por si no puede encotnrar el producto
  }

  if (discount !== undefined) {
    if (discount < 0 || discount > 100) {
      throw new Error('El descuento debe estar entre 0% y 100%.');
    }
  }

  if (stock !== undefined) {
    if (stock < 0) {
      throw new Error('El stock no puede ser negativo.');
    }
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

const restoreProductById = async (productId) => {
  const product = await Product.findByPk(productId, { paranoid: false });
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  product.restore();
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
  restoreProductById,
  sugestProducts,
};
