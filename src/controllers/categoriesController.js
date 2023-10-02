const { Category } = require("../db");
const { Op } = require("sequelize");

const getAllCategories = async () => {
  const categories = await Category.findAll();
  return categories;
};

const searchCategoryByName = async (categoryName) => {
  console.log(categoryName);

  const results = await Category.findAll({
    where: {
      name: {
        [Op.iLike]: `%${categoryName}%`, //* Búsqueda inexacta (y tampoco distingue mayúsculas/minúsculas)
      },
    },
  });
  return results;
};
const getCategoryById = async (id) => {
  const category = await category.findByPk(id);
  return category ? category : null;
};

const createNewCategory = async (category) => {
  const { name } = category;
  const newCategory = await Category.create({ name });
  return newCategory;
};

const bulkCreateNewCategory = async (categories) => {
  // console.log(categories);
  Category.bulkCreate(categories);
};

module.exports = {
  getAllCategories,
  searchCategoryByName,
  getCategoryById,
  createNewCategory,
  bulkCreateNewCategory,
};
