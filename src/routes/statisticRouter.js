const { Router } = require("express");
const {
    getCountCustomerHandler,
    getCountOrdersHandler,
    getTotalSalesHandler,
} = require("../handlers/statisticsHandler");

const statisticRouter = Router();

statisticRouter.get("/customer", getCountCustomerHandler);
statisticRouter.get("/order", getCountOrdersHandler);
statisticRouter.get("/sales", getTotalSalesHandler);

module.exports = statisticRouter;