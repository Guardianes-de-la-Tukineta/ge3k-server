const { Router } = require('express');
const productsRouter = require("./productsRouter");
const customersRouter = require("./customersRouter");

const router = Router();

router.use('/products', productsRouter);
router.use('/customers', customersRouter);


module.exports = router;