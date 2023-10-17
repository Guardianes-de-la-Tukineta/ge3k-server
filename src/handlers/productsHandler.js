const {
  getAllProducts,
  createNewProduct,
  createBulkNewProduct,
  getProductById,
  deleteProductById,
  updateProductById,
  sugestProducts,
} = require("../controllers/productsController");

const getProductsHandler = async (req, res) => {
  const filterObject = req.query;
  try {
    const results = await getAllProducts(filterObject);
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
      message: "Producto creado exitosamente",
      productId: newProduct.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const createBulkProductHandler = async (req, res) => {
  try {
    const bulkData = req.body;
    const bulkNewProduct = createBulkNewProduct(bulkData);
    res.status(200).json("Productos creados exitosamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const productById = await getProductById(id);

    return productById
      ? res.status(200).json(productById)
      : res.status(404).json({ message: "Producto no encontrado." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteProductHandler = async (req, res) => {
  try {
    const { productId, type } = req.query;
    const product = await deleteProductById(productId, type);
    res.status(200).json({ message: `Producto ${product.name} eliminado` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    const updatedProduct = await updateProductById(id, productData);

    if (updatedProduct) {
      res.status(200).json({
        message: `Producto con ID ${id} actualizado exitosamente`,
      });
    } else {
      res.status(404).json({ message: "Producto no encontrado." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const sugestProductHandler = async (req, res) => {
  try {
    const { name } = req.query;
    const results = await sugestProducts(name);
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProductsHandler,
  createProductHandler,
  createBulkProductHandler,
  getProductByIdHandler,
  deleteProductHandler,
  updateProductHandler,
  sugestProductHandler,
};
