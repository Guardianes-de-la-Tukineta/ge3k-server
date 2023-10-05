const { Router } = require('express');
const {
  getCustomersHandler,
  createCustomerHandler,
  getCustomerByIdHandler,
  deleteCustomerHandler,
  updateCustomerHandler,
} = require('../handlers/customersHandler');

const customersRouter = Router();

customersRouter.get('/', getCustomersHandler);
customersRouter.post('/', createCustomerHandler);
customersRouter.get('/:id', getCustomerByIdHandler);
customersRouter.delete('/:id', deleteCustomerHandler);
customersRouter.put('/:id', updateCustomerHandler);


module.exports = customersRouter;
