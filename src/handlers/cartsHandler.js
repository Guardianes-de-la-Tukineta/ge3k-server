const {
  getCart,
  createNewCart,
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
    res.status(200).json({
      message: "Producto agregado al carrito exitosamente",
      cartId: newCart.id,
    });
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
      res.status(200).json({
        message: "Producto eliminado del carrito",
        productId: deletedCart.id,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCartsHandler,
  createCartHandler,
  deleteCartHandler,
};
