const {
  getCart,
  createNewCart,
  createBulkCart,
  deleteCart,
  deleteBulkCart,
} = require("../controllers/cartsController");

const getCartsHandler = async (req, res) => {
  const { customerId } = req.query;
  try {
    const cart = await getCart(customerId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createCartHandler = async (req, res) => {
  try {
    const { customerId, productId, quantity } = req.body;
    const newCart = await createNewCart(customerId, productId, quantity);
    res.status(200).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBulkCartHandler = async (req, res) => {
  try {
    const { customerId, products } = req.body;
    const newCart = await createBulkCart(customerId, products);
    res.status(200).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCartHandler = async (req, res) => {
  try {
    const { customerId, productId } = req.query;

    if (productId === "ALL") {
      await deleteBulkCart(customerId);
      res.status(200).json({ message: "Carrito vaciado exitosamente" });
    } else {
      const deletedCart = await deleteCart(customerId, productId);
      res.status(200).json(deletedCart);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCartsHandler,
  createCartHandler,
  deleteCartHandler,
  createBulkCartHandler,
};
