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

const getCustomerById = async (id) => {
  try {
    const customer = await Customer.findByPk(id);
    return customer;
  } catch (error) {
    throw error;
  }
};

const deleteCustomerById = async (id) => {
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      throw new Error('Cliente no encontrado');
    }
    await customer.destroy();
  } catch (error) {
    throw error;
  }
};

const updateCustomerById = async (id, customerData) => {
  try {
    const { name, surname, birthdate, email, password, phone, address, paymentMethod, category } = customerData;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return null; //* Esto es por si no puede encotnrar el producto
    }

    //* Acá lo que hago es que actualice ÚNICAMENTE los campos que le paso
    if (name) {
      customer.name = name;
    }
    if (surname) {
      customer.price = price;
    }
    if (birthdate) {
      customer.surname = surname;
    }
    if (email) {
      customer.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      customer.password = hashedPassword;
    }
    if (phone) {
      customer.phone = phone;
    }
    if (address) {
      customer.address = address;
    }
    if (paymentMethod) {
      customer.paymentMethod = paymentMethod;
    }
    if (category !== undefined) {
      customer.category = category;
    }

    await customer.save();

    return customer;
  } catch (error) {
    throw error;
  }
};

const getCustomerByEmail = async (email) => {
  try {
    const customer = await Customer.findOne({
      where: {
        email: email,
      },
    });
    return customer;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  getAllCustomers,
  searchCustomerByName,
  createNewCustomer,
  getCustomerById,
  deleteCustomerById,
  updateCustomerById,
  getCustomerByEmail,
};
