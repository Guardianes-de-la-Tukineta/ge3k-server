const { Router } = require("express");
const {
  getThemesHandler,
  createThemeHandler,
  getThemeByIdHandler,
  deleteThemeHandler,
  updateThemeHandler,
} = require("../handlers/themesHandler");

const themesRouter = Router();

themesRouter.get("/", getThemesHandler);
themesRouter.post("/", createThemeHandler);
themesRouter.get("/:id", getThemeByIdHandler);
themesRouter.delete("/:id", deleteThemeHandler);
themesRouter.put("/:id", updateThemeHandler);

module.exports = themesRouter;
