const { Router } = require('express');
const {
  getOrdersHandler,
  createOrdersHandler,
  getOrdersByCustomerIdHandler,
  getOrderDetailByOrderIdHandler,
} = require('../handlers/ordersHandler');

const ordersRouter = Router();

ordersRouter.get('/', getOrdersHandler);
ordersRouter.post('/', createOrdersHandler);
ordersRouter.get('/customers/:customerId', getOrdersByCustomerIdHandler);
ordersRouter.get('/detail/:orderId', getOrderDetailByOrderIdHandler);

module.exports = ordersRouter;
