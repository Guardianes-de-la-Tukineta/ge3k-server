const { Router } = require('express');
const productsRouter = require("./productsRouter");
const customersRouter = require("./customersRouter");
const favoritesRouter = require('./favoritesRouter');
const categoriesRouter = require('./categoriesRouter');
const themesRouter = require('./themesRouter');
const cartsRouter = require('./cartsRouter');
const adminRouter = require('./adminRouter');

const router = Router();

router.use('/products', productsRouter);
router.use('/customers', customersRouter);
router.use('/favorites', favoritesRouter);
router.use('/categories', categoriesRouter);
router.use('/themes', themesRouter);
router.use('/carts', cartsRouter);
router.use('/admin', adminRouter);



module.exports = router;