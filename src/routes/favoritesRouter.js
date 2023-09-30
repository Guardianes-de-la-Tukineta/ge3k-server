const { Router } = require("express");
const {
  getFavoritesHandler,
  createFavoriteHandler,
  deleteFavoriteHandler,
} = require("../handlers/favoritesHandler");

const favoritesRouter = Router();

favoritesRouter.get("/", getFavoritesHandler);
favoritesRouter.post("/", createFavoriteHandler);
favoritesRouter.delete('/', deleteFavoriteHandler)

module.exports = favoritesRouter;
