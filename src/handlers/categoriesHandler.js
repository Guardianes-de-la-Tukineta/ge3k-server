const {
  getAllCategories,
  searchCategoryByName,
  createNewCategory,
  getCategoryById,
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
    const productData = req.body;

    const newCategory = await createNewCategory(productData);

    return res.status(201).json({
      message: 'Categoryo creado exitosamente',
      productId: newCategory.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getCategoryByIdHandler = async (req, res) => { 
  try {
    const { id } = req.params;

    const productById = await getCategoryById(id);

    return productById
      ? res.status(200).json(productById)
      : res.status(404).json({ message: 'Categoryo no encontrado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getCategoriesHandler,
  createCategoryHandler,
  getCategoryByIdHandler,
};