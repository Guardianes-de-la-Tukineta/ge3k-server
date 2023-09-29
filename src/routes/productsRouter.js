const { Router } = require('express');
const {
  getProductsHandler,
  createProductHandler,
  getProductByIdHandler,
} = require('../handlers/productsHandler');

const productsRouter = Router();

productsRouter.get("/", getProductsHandler);
productsRouter.post('/', createProductHandler);
productsRouter.get('/:id', getProductByIdHandler);

module.exports = productsRouter;