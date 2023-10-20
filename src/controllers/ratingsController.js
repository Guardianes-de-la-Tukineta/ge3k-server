const { Product, Order, OrderDetail, Customer, Rating } = require('../db');

const createNewReviewController = async (
  CustomerId,
  ProductId,
  rating,
  Comment
) => {
  //* Acá verificamos si la relación entre Customer y Product existe
  const customer = await Customer.findByPk(CustomerId);
  const product = await Product.findByPk(ProductId);

  if (!customer || !product) {
    throw new Error('Cliente o Producto NO encontrados');
  }

  //* Controlamos si ya existe un rating de este CustomerId respecto a este ProductId
  const existingRating = await Rating.findOne({
    where: { CustomerId, ProductId },
  });

  if (existingRating) {
    throw new Error('Ya has creado un rating para este producto.');
  }

  //* También validamos el valor del nuevo rating
  if (rating < 1 || rating > 5) {
    throw new Error('El rating debe estar entre 1 y 5');
  }

  //* Controlamos si existe una Order asociada al CustomerId y ProductId
  const order = await Order.findOne({
    where: { CustomerId },
    include: [
      {
        model: OrderDetail,
        include: [
          {
            model: Product,
            where: { id: ProductId },
          },
        ],
      },
    ],
  });

  if (!order) {
    throw new Error('No se encontró una conexión');
  }

  //* Recién cuando pasemos todas las validaciones, se crea la revisión (rating)
  const newRating = await Rating.create({
    rating,
    Comment,
    CustomerId,
    ProductId,
  });

  return newRating;
};

const getRatingsByProductId = async (ProductId) => {
  //* Acá se busca los ratings que estén asociados al ProductId
  const ratings = await Rating.findAll({
    where: { ProductId },
  });

  return ratings;
};

const getRatingsByCustomerId = async (CustomerId) => {
  //* Aquí buscamos los ratings que estén asociados al CustomerId
  const ratings = await Rating.findAll({
    where: { CustomerId },
  });

  return ratings;
};

const updateRating = async (CustomerId, ProductId, rating, Comment) => {
  //* Controlamos que la relación entre Customer y Product exista
  const customer = await Customer.findByPk(CustomerId);
  const product = await Product.findByPk(ProductId);

  if (!customer || !product) {
    throw new Error('Cliente o Producto NO encontrados');
  }

  //* Chequeamos si ya existe un rating de este CustomerId respecto a este ProductId
  const existingRating = await Rating.findOne({
    where: { CustomerId, ProductId },
  });

  if (!existingRating) {
    throw new Error('No has creado un rating para este producto previamente.');
  }

  //* Volvemos a validar el rating
  if (rating < 1 || rating > 5) {
    throw new Error('El rating debe estar entre 1 y 5');
  }

  //* Y acá es cuando actualizamos el rating existente
  existingRating.rating = rating;
  existingRating.Comment = Comment;
  await existingRating.save();

  return existingRating;
};

module.exports = {
  createNewReviewController,
  getRatingsByProductId,
  getRatingsByCustomerId,
  updateRating,
};
