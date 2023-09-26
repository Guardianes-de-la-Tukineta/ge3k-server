const { Router } = require("express");
const productsRouter = require("./productsRouter");

const router = Router();

router.use("/products", productsRouter)

module.exports = router;
