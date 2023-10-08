const { Router } = require('express');
const {
  getCustomersHandler,
  createCustomerHandler,
  getCustomerByIdHandler,
  deleteCustomerHandler,
  updateCustomerHandler,
  getCustomerByEmailHandler,
} = require('../handlers/customersHandler');

const customersRouter = Router();

customersRouter.get('/', getCustomersHandler);
customersRouter.post('/', createCustomerHandler);
customersRouter.get('/:id', getCustomerByIdHandler);
customersRouter.delete('/:id', deleteCustomerHandler);
customersRouter.put('/:id', updateCustomerHandler);
customersRouter.get('/email/:email', getCustomerByEmailHandler);


module.exports = customersRouter;
