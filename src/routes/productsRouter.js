const { Router } = require("express");
const {
  getProductsHandler,
  createProductHandler,
  createBulkProductHandler,
  getProductByIdHandler,
  deleteProductHandler,
  updateProductHandler,
  restoreProductHandler,
  sugestProductHandler,
} = require("../handlers/productsHandler");

const productsRouter = Router();

productsRouter.get("/", getProductsHandler);
productsRouter.get("/sugest", sugestProductHandler);
productsRouter.post("/", createProductHandler);
productsRouter.post("/bulk", createBulkProductHandler);
productsRouter.get("/:id", getProductByIdHandler);
productsRouter.delete("/", deleteProductHandler);
productsRouter.put("/restore", restoreProductHandler);
productsRouter.put("/:id", updateProductHandler);

module.exports = productsRouter;
