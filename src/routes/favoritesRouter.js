const { Router } = require("express");
const {
  getFavoritesHandler,
  createFavoriteHandler,
  createBulkFavoriteHandler,
  deleteFavoriteHandler,
} = require("../handlers/favoritesHandler");

const favoritesRouter = Router();

favoritesRouter.get("/", getFavoritesHandler);
favoritesRouter.post("/", createFavoriteHandler);
favoritesRouter.post("/bulk", createBulkFavoriteHandler);
favoritesRouter.delete('/', deleteFavoriteHandler)

module.exports = favoritesRouter;
