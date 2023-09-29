const { Router } = require('express');
const {
  getProductsHandler,
  createProductHandler,
} = require('../handlers/productsHandler');

const productsRouter = Router();

productsRouter.get("/", getProductsHandler);
productsRouter.post('/', createProductHandler);

module.exports = productsRouter;