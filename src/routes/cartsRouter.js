const { Router } = require("express");
const {
  getCartsHandler,
  createCartHandler,
  deleteCartHandler,
  createBulkCartHandler,
} = require("../handlers/cartsHandler");

const cartsRouter = Router();

cartsRouter.get("/", getCartsHandler);
cartsRouter.post("/", createCartHandler);
cartsRouter.post("/bulk", createBulkCartHandler);
cartsRouter.delete("/", deleteCartHandler);

module.exports = cartsRouter;
