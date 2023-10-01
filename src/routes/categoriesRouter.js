const { Router } = require('express');
const { getCategoriesHandler, createCategoryHandler,getCategoryByIdHandler } = require('../handlers/categoriesHandler');

const categoriesRouter = Router();

categoriesRouter.get('/', getCategoriesHandler);
categoryRouter.post('/', createCategoryHandler);
categoryRouter.get('/:id', getCategoryByIdHandler);


module.exports = categoriesRouter;
