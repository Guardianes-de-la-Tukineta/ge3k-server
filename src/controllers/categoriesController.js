const { Category } = require("../db");
const { Op } = require("sequelize");
const { categoryFormat } = require("../utils/utils");

const getAllCategories = async () => {
  const categories = await Category.findAll();
  return categories.map((category) => categoryFormat(category));
};

const searchCategoryByName = async (categoryName) => {

  const results = await Category.findAll({
    where: {
      name: {
        [Op.iLike]: `%${categoryName}%`, //* Búsqueda inexacta (y tampoco distingue mayúsculas/minúsculas)
      },
    },
  });
  return results.map((result) => categoryFormat(result));
};
const getCategoryById = async (id) => {
  const category = await Category.findByPk(id);
  return category ? categoryFormat(category) : null;
};

const createNewCategory = async (category) => {
  const { name } = category;
  const newCategory = await Category.create({ name });
  return newCategory;
};

const bulkCreateNewCategory = async (categories) => {
  await Category.bulkCreate(categories);
};

module.exports = {
  getAllCategories,
  searchCategoryByName,
  getCategoryById,
  createNewCategory,
  bulkCreateNewCategory,
};
