const { Router } = require('express');
const { getCategoriesHandler, 
    createCategoryHandler,
    getCategoryByIdHandler,
    deleteCategoryHandler,
    updateCategoryHandler

} = require('../handlers/categoriesHandler');

const categoriesRouter = Router();


categoriesRouter.get('/', getCategoriesHandler);
categoriesRouter.post('/', createCategoryHandler);
categoriesRouter.get('/:id', getCategoryByIdHandler);
categoriesRouter.delete("/:id", deleteCategoryHandler);
categoriesRouter.put("/:id", updateCategoryHandler);

module.exports = categoriesRouter;

