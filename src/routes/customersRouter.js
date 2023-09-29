const { Router } = require('express');
const { getCustomersHandler, createCustomerHandler } = require('../handlers/customersHandler');

const customersRouter = Router();

customersRouter.get('/', getCustomersHandler);
customersRouter.post('/', createCustomerHandler);


module.exports = customersRouter;
