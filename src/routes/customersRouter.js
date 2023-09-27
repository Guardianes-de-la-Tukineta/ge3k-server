const { Router } = require('express');
const { getCustomersHandler } = require('../handlers/customersHandler');

const customersRouter = Router();

customersRouter.get('/', getCustomersHandler);

module.exports = customersRouter;
