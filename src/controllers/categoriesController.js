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
const updateCategoryById = async (id, categoryData) => {
  const {name} = categoryData;

  const category = await Category.findByPk(id);

  if (!category) {
    return null;
  }
  if (name) {
    category.name = name;
  }
 
  await category.save();

  return category;


};
const deleteCategoryById = async (id) => {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error("categoria no encontrada");
    }
    await category.destroy();
    return { message: "categoria eliminada"
  }
};



const bulkCreateNewCategory = async (categories) => {
  await Category.bulkCreate(categories);
};

module.exports = {
  getAllCategories,
  searchCategoryByName,
  getCategoryById,
  createNewCategory,
  updateCategoryById,
  deleteCategoryById,
  bulkCreateNewCategory,
};
