const { Router } = require("express");
const {
  getOrdersHandler,
  createOrdersHandler,
  updateOrderHandler,
  fulfillOrderHandler,
  getOrdersByCustomerIdHandler,
  getOrderDetailByOrderIdHandler,
  deleteOrderHandler,
} = require("../handlers/ordersHandler");

const ordersRouter = Router();

ordersRouter.get("/", getOrdersHandler);
ordersRouter.post("/", createOrdersHandler);
ordersRouter.put("/", updateOrderHandler);
ordersRouter.put("/fulfill", fulfillOrderHandler);
ordersRouter.get("/customers/:customerId", getOrdersByCustomerIdHandler);
ordersRouter.get("/detail/:orderId", getOrderDetailByOrderIdHandler);
ordersRouter.delete("/:id", deleteOrderHandler);

module.exports = ordersRouter;
