const {
  getAllFavorites,
  createNewFavorite,
  deleteFavorite,
} = require("../controllers/favoritesController");

const getFavoritesHandler = async (req, res) => {
  const { customerId } = req.query;
  try {
    const favorites = await getAllFavorites(customerId);
    res.status(200).json(favorites);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createFavoriteHandler = async (req, res) => {
  try {
    const { customerId, productId } = req.body;
    const newFavorite = await createNewFavorite(customerId, productId);
    res.status(200).json({
      message: "Favorito creado exitosamente",
      favoriteId: newFavorite.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFavoriteHandler = async (req, res) => {
  const { customerId, productId } = req.body;
  try {
    delFavorite = await deleteFavorite(customerId, productId);
    res.status(200).json(delFavorite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getFavoritesHandler,
  createFavoriteHandler,
  deleteFavoriteHandler,
};
