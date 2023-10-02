const { Router } = require('express');
const { getCategoriesHandler, createCategoryHandler,getCategoryByIdHandler } = require('../handlers/categoriesHandler');

const categoriesRouter = Router();


categoriesRouter.get('/', getCategoriesHandler);
categoriesRouter.post('/', createCategoryHandler);
categoriesRouter.get('/:id', getCategoryByIdHandler);


module.exports = categoriesRouter;

