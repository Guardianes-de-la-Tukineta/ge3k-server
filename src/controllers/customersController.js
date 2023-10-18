const { Customer } = require('../db');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const getAllCustomers = async () => {
  const customers = await Customer.findAll({paranoid: false});
  return customers;
};

const searchCustomerByName = async (customerName) => {
  const results = await Customer.findAll({
    where: {
      name: {
        [Op.iLike]: `%${customerName}%`, //* Búsqueda inexacta (y tampoco distingue mayúsculas/minúsculas)
      },
    },
  });
  return results;
};

const createNewCustomer = async (customer) => {
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
};

const getCustomerById = async (id) => {
  const customer = await Customer.findByPk(id);
  return customer;
};

const deleteCustomerById = async (id) => {
  const customer = await Customer.findByPk(id);
  if (!customer) {
    throw new Error('Cliente no encontrado');
  }
  await customer.destroy();
};

const updateCustomerById = async (id, customerData) => {
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
  } = customerData;

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
};

const getCustomerByEmail = async (email) => {
  const customer = await Customer.findOne({
    where: {
      email: email,
    },
  });
  return customer;
};

const updateCustomerByEmail = async (email, updatedData) => {
  const customer = await Customer.findOne({
    where: {
      email: email,
    },
  });

  if (!customer) {
    return null;
  }

  const { name, surname, birthdate, phone, address, paymentMethod, category } =
    updatedData;

  if (name) {
    customer.name = name;
  }
  if (surname) {
    customer.surname = surname;
  }
  if (birthdate) {
    customer.birthdate = birthdate;
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
};
const restoreCustomerById = async (id) => {
  const customer = await Customer.findByPk(id, { paranoid: false });
  if (!customer) {
    throw new Error('customer no encontrado');
  }
  await customer.restore();
} 


module.exports = {
  getAllCustomers,
  searchCustomerByName,
  createNewCustomer,
  getCustomerById,
  deleteCustomerById,
  updateCustomerById,
  getCustomerByEmail,
  updateCustomerByEmail,
  restoreCustomerById,
};
