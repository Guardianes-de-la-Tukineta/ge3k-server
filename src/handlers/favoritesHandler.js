const {
  getAllFavorites,
  createNewFavorite,
  createBulkFavorite,
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

const createBulkFavoriteHandler = async (req, res) => {
  try {
    const { customerId, products } = req.body;
    const newFavorite = await createBulkFavorite(customerId, products);
    res.status(200).json(newFavorite);
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
  createBulkFavoriteHandler,
  deleteFavoriteHandler,
};
