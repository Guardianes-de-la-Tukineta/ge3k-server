const { Router } = require("express");

const { sendMailHandler } = require("../handlers/mailHandler");

const mailRouter = Router();

mailRouter.post("/", sendMailHandler);

module.exports = mailRouter;
