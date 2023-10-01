const { Router } = require('express');
const productsRouter = require("./productsRouter");
const customersRouter = require("./customersRouter");
const favoritesRouter = require('./favoritesRouter');
const categoriesRouter = require('./categoriesRouter');
const themesRouter = require('./themesRouter');

const router = Router();

router.use('/products', productsRouter);
router.use('/customers', customersRouter);
router.use('/favorites', favoritesRouter);
router.use('/categories', categoriesRouter);
router.use('/themes', themesRouter);



module.exports = router;