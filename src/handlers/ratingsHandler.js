const {
  createNewReviewController,
  getRatingsByProductId,
  getRatingsByCustomerId,
  updateRating,
} = require('../controllers/ratingsController');

const createReviewHandler = async (req, res) => {
  const { CustomerId, ProductId, rating, Comment } = req.body;

  try {
    const newRating = await createNewReviewController(
      CustomerId,
      ProductId,
      rating,
      Comment
    );

    res
      .status(201)
      .json({ message: 'Revisión creada exitosamente', rating: newRating });
  } catch (error) {
    if (error.message === 'Ya has creado un rating para este producto.') {
      //! Acá manejamos la excepción específica cuando ya existe un rating
      res.status(400).json({ error: error.message });
    } else {
      console.error('Error al buscar la conexión o crear la revisión:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

const getRatingsByProductIdHandler = async (req, res) => {
  const { ProductId } = req.params;

  try {
    const ratings = await getRatingsByProductId(ProductId);

    res.status(200).json({ ratings });
  } catch (error) {
    console.error('Error al buscar los ratings:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getRatingsByCustomerIdHandler = async (req, res) => {
  const { CustomerId } = req.params;

  try {
    const ratings = await getRatingsByCustomerId(CustomerId);

    res.status(200).json({ ratings });
  } catch (error) {
    console.error('Error al buscar los ratings:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateRatingHandler = async (req, res) => {
  const { CustomerId, ProductId, rating, Comment } = req.body;

  try {
    const updatedRating = await updateRating(
      CustomerId,
      ProductId,
      rating,
      Comment
    );

    res.json({
      message: 'Rating actualizado exitosamente',
      rating: updatedRating,
    });
  } catch (error) {
    if (
      error.message ===
      'No has creado un rating para este producto previamente.'
    ) {
      res.status(400).json({ error: error.message });
    } else if (
      error.message === 'Cliente o Producto NO encontrados' ||
      error.message === 'El rating debe estar entre 1 y 5'
    ) {
      res.status(400).json({ error: error.message });
    } else {
      console.error('Error al actualizar el rating:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};


module.exports = {
  createReviewHandler,
  getRatingsByProductIdHandler,
  getRatingsByCustomerIdHandler,
  updateRatingHandler,
};
