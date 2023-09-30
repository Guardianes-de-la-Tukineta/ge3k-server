const { Router } = require('express');
const productsRouter = require("./productsRouter");
const customersRouter = require("./customersRouter");
const favoritesRouter = require('./favoritesRouter')

const router = Router();

router.use('/products', productsRouter);
router.use('/customers', customersRouter);
router.use('/favorites', favoritesRouter);


module.exports = router;