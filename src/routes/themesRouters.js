const { Router } = require('express');
const { getThemesHandler, createThemeHandler } = require('../handlers/themesHandler');

const themesRouter = Router();

themesRouter.get('/', getThemesHandler);
themesRouter.post('/', createThemeHandler);
categoryRouter.get('/:id', getThemeByIdHandler);


module.exports = themesRouter;
