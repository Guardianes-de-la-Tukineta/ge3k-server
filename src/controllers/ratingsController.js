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

  if (!customer) {
    throw new Error('Cliente NO encontrados');
  }

  if (!product) {
    throw new Error('Producto NO encontrados');
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
  // const order = await Order.findOne({
  //   where: { CustomerId },
  //   include: [
  //     {
  //       model: OrderDetail,
  //       include: [
  //         {
  //           model: Product,
  //           where: { id: ProductId },
  //         },
  //       ],
  //     },
  //   ],
  // });

  // if (!order) {
  //   throw new Error('No se encontró una conexión');
  // }

  const customerName = customer.name;

  //* Recién cuando pasemos todas las validaciones, se crea la revisión (rating)
  const newRating = await Rating.create({
    rating,
    Comment,
    CustomerId,
    ProductId,
    CustomerName: customerName,
  });

  // return newRating;
  return {
      id: newRating.id,
      rating: newRating.rating,
      Comment: newRating.Comment,
      CustomerId: newRating.CustomerId,
      ProductId: newRating.ProductId,
      CustomerName: customerName,
      updatedAt: newRating.updatedAt,
      createdAt: newRating.createdAt,
      deletedAt: newRating.deletedAt,
  }
};

const getRatingsByProductId = async (ProductId) => {
  //* Acá se busca los ratings que estén asociados al ProductId
  const ratings = await Rating.findAll({
    where: { ProductId },
    include: Customer,
  });

  const ratingsWithCustomerName = ratings.map((rating) => ({
    id: rating.id,
    rating: rating.rating,
    Comment: rating.Comment,
    CustomerId: rating.CustomerId,
    ProductId: rating.ProductId,
    CustomerName: rating.Customer.name,
    updatedAt: rating.updatedAt,
    createdAt: rating.createdAt,
    deletedAt: rating.deletedAt,
  }));

  return ratingsWithCustomerName;
};

const getRatingsByCustomerId = async (CustomerId) => {
  //* Aquí buscamos los ratings que estén asociados al CustomerId
  const ratings = await Rating.findAll({
    where: { CustomerId },
    include: Customer,
  });

  const ratingsWithCustomerName = ratings.map((rating) => ({
    id: rating.id,
    rating: rating.rating,
    Comment: rating.Comment,
    CustomerId: rating.CustomerId,
    ProductId: rating.ProductId,
    CustomerName: rating.Customer.name,
    updatedAt: rating.updatedAt,
    createdAt: rating.createdAt,
    deletedAt: rating.deletedAt,
  }));

  return ratingsWithCustomerName;
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

const deleteRatingController = async (ratingId, CustomerId) => {
  //* Acá buscamos el rating que queremos eliminar
  const rating = await Rating.findByPk(ratingId);

  if (!rating) {
    throw new Error('Rating no encontrado');
  }

  //* Controlamos si el CustomerId coincide con el cliente que creó el rating
  if (rating.CustomerId !== CustomerId) {
    throw new Error('No tienes permiso para eliminar este rating');
  }

  //! Eliminamos el rating
  await rating.destroy();

  return 'Rating eliminado exitosamente';
};



module.exports = {
  createNewReviewController,
  getRatingsByProductId,
  getRatingsByCustomerId,
  updateRating,
  deleteRatingController,
};
