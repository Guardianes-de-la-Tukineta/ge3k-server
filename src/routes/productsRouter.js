const { Router } = require('express');
const {
    getProductsHandler
} = require("../handlers/productsHandler");


const productsRouter = Router();

productsRouter.get("/", getProductsHandler);


module.exports = productsRouter;