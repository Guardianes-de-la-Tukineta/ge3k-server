const { Router } = require("express");
const {
  getCartsHandler,
  createCartHandler,
  deleteCartHandler,
} = require("../handlers/cartsHandler");

const cartsRouter = Router();

cartsRouter.get("/", getCartsHandler);
cartsRouter.post("/", createCartHandler);
cartsRouter.delete("/", deleteCartHandler);

module.exports = cartsRouter;
