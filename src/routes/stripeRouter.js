const { Router } = require("express");

const { createSessionHandler } = require("../handlers/stripeHandler");

const stripeRouter = Router();

stripeRouter.post("/", createSessionHandler);

module.exports = stripeRouter;
