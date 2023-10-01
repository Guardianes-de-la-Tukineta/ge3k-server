const { Router } = require('express');
const { getThemesHandler, createThemeHandler,getThemeByIdHandler } = require('../handlers/themesHandler');

const themesRouter = Router();

themesRouter.get('/', getThemesHandler);
themesRouter.post('/', createThemeHandler);
themesRouter.get('/:id', getThemeByIdHandler);


module.exports = themesRouter;
