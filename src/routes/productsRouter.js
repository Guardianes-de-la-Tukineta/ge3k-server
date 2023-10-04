const { Router } = require('express');
const {
  getProductsHandler,
  createProductHandler,
  createBulkProductHandler,
  getProductByIdHandler,
  deleteProductHandler,
  updateProductHandler,
} = require('../handlers/productsHandler');

const productsRouter = Router();

productsRouter.get("/", getProductsHandler);
productsRouter.post('/', createProductHandler);
productsRouter.post('/bulk', createBulkProductHandler);
productsRouter.get('/:id', getProductByIdHandler);
productsRouter.delete('/:id', deleteProductHandler);
productsRouter.put('/:id', updateProductHandler);

module.exports = productsRouter;