const { Customer } = require('../db');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

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
          [Op.iLike]: `%${customerName}%`, //* Búsqueda inexacta (y tampoco distingue mayúsculas/minúsculas)
        },
      },
    });
    return results;
  } catch (error) {
    throw new Error('Error al buscar clientes por nombre');
  }
};

const createNewCustomer = async (customer) => { 
   try {
     const {
       name,
       surname,
       birthdate,
       email,
       password,
       phone,
       address,
       paymentMethod,
       category,
     } = customer;

     const hashedPassword = await bcrypt.hash(password, 10);

     const newCustomer = await Customer.create({
       name,
       surname,
       birthdate,
       email,
       password: hashedPassword,
       phone,
       address,
       paymentMethod,
       category,
     });

     return newCustomer;
   } catch (error) {
     throw error;
   }
}

module.exports = { getAllCustomers, searchCustomerByName, createNewCustomer };
