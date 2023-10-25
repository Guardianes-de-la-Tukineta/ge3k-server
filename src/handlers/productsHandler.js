const { Rating } = require('../db');
const {
  getAllProducts,
  createNewProduct,
  createBulkNewProduct,
  getProductById,
  deleteProductById,
  updateProductById,
  restoreProductById,
  sugestProducts,
} = require('../controllers/productsController');

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
      message: 'Producto creado exitosamente',
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
    res.status(200).json('Productos creados exitosamente');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductByIdHandler = async (req, res) => {
  // try {
  //   const { id } = req.params;

  //   const product = await getProductById(id);

  //   if (product) {
  //     //* Acá agarro los ratings del producto
  //     const ratings = await Rating.findAll({ where: { ProductId: id } });

  //     //* Metemos los ratings al objeto del producto
  //     product.ratings = ratings;

  //     res.status(200).json(product);
  //   } else {
  //     res.status(404).json({ message: 'Producto no encontrado.' });
  //   }
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: error.message });
  // }

  try {
    const { id } = req.params;

    const product = await getProductById(id);

    if (product) {
      if (product.ratings) {
        const ratings = product.ratings.map((rating) => {
          const customerName = rating.Customer
            ? rating.Customer.name
            : 'Anónimo';

          return {
            id: rating.id,
            rating: rating.rating,
            Comment: rating.Comment,
            customerId: rating.customerId,
            productName: product.name,
            customerName,
          };
        });

        product.ratings = ratings;
      }

      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado.' });
    }
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
      res.status(404).json({ message: 'Producto no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const restoreProductHandler = async (req, res) => {
  try {
    const { productId } = req.query;
    const product = await restoreProductById(productId);
    res.status(200).json({ message: `Producto ${product.name} restaurado` });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
  restoreProductHandler,
  sugestProductHandler,
};
