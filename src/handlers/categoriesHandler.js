const {
  getAllCategories,
  searchCategoryByName,
  createNewCategory,
  getCategoryById,
  deleteCategoryById,
  updateCategoryById,
} = require('../controllers/categoriesController');

const getCategoriesHandler = async (req, res) => {
  const { name } = req.query;
  try {
    const results = name
      ? await searchCategoryByName(name)
      : await getAllCategories();
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createCategoryHandler = async (req, res) => {
  try {
    const categoryData = req.body;

    const newCategory = await createNewCategory(categoryData);

    return res.status(201).json({
      message: 'Category creada exitosamente',
      categoryId: newCategory.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getCategoryByIdHandler = async (req, res) => { 
  try {
    const { id } = req.params;

    const categoryById = await getCategoryById(id);

    return categoryById
      ? res.status(200).json(categoryById)
      : res.status(404).json({ message: 'Categoria no encontrada.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
const deleteCategoryHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCategoryById(id);
    res.status(200).json({ message: `Categoria con id ${id} eliminada` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateCategoryHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;

    const updatedCategory = await updateCategoryById(id, categoryData);

    if (updatedCategory) {
      res.status(200).json({
        message: `Categoria con ID ${id} actualizada exitosamente`,
      });
    } else {
      res.status(404).json({ message: "categoria no encontrada." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getCategoriesHandler,
  createCategoryHandler,
  getCategoryByIdHandler,
  deleteCategoryHandler,
  updateCategoryHandler,
};