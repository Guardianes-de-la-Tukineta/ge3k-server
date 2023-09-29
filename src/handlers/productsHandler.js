const {
  getAllProducts,
  searchProductByName,
  createNewProduct,
} = require('../controllers/productsController');

const getProductsHandler = async (req, res) => {
  const { name } = req.query;
  try {
    const results = name
      ? await searchProductByName(name)
      : await getAllProducts();
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createProductHandler = async (req, res) => {
  try {
    const productData = req.body;

    const newProduct = await createNewProduct(productData);

    return res.status(201).json({
      message: 'Producto creado exitosamente',
      productId: newProduct.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProductsHandler,
  createProductHandler,
};
