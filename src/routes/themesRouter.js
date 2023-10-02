const { Router } = require("express");
const {
  getThemesHandler,
  createThemeHandler,
  bulkCreateThemeHandler,
  getThemeByIdHandler,
} = require("../handlers/themesHandler");

const themesRouter = Router();

themesRouter.get("/", getThemesHandler);
themesRouter.post("/", createThemeHandler);
themesRouter.post("/bulk", bulkCreateThemeHandler);
themesRouter.get("/:id", getThemeByIdHandler);

module.exports = themesRouter;
