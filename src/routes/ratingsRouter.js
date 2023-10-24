const { Router } = require('express');
const {
  createReviewHandler,
  getRatingsByProductIdHandler,
  getRatingsByCustomerIdHandler,
  updateRatingHandler,
  deleteRatingHandler,
} = require('../handlers/ratingsHandler');

const ratingsRoutes = Router();

ratingsRoutes.post('/', createReviewHandler);
ratingsRoutes.get('/:ProductId', getRatingsByProductIdHandler);
ratingsRoutes.get('/customers/:CustomerId', getRatingsByCustomerIdHandler);
ratingsRoutes.put('/', updateRatingHandler);
ratingsRoutes.delete('/:ratingId', deleteRatingHandler);

module.exports = ratingsRoutes;
