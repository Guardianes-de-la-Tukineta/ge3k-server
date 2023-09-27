const { Customer } = require('../db');

//getData from 5000
const getAllCustomers = async () => {
  try {
    const customers = await Customer.findAll();
    return customers;
  } catch (error) {
    throw error;
  }
};

const searchCustomerByName = async (customerName) => {
  try {
    const results = await Customer.findAll({
      where: {
        name: {
          [Sequelize.Op.iLike]: `%${customerName}%`, //* Búsqueda inexacta (y tampoco distingue mayúsculas/minúsculas)
        },
      },
    });
    return results;
  } catch (error) {
    throw new Error('Error al buscar productos por nombre');
  }
};

module.exports = { getAllCustomers, searchCustomerByName };
