const { Router } = require("express");

const {
  createSessionHandler,
  getBillHandler,
} = require("../handlers/stripeHandler");

const stripeRouter = Router();

stripeRouter.post("/", createSessionHandler);
stripeRouter.post("/bill", getBillHandler);

module.exports = stripeRouter;
