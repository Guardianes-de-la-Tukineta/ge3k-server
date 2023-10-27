const sequelize = require('sequelize');
const { Customer, Order, OrderDetail} = require('../db.js'); 

const countCustomers = async () => {
    const customers = await Customer.count();
    return customers;
};

const countOrders = async () => {
    const orders = await Order.count({ where:
        { status:  ['Approved', 'Fulfilled']} });
    return orders;
};

const totalSales = async () => {
    const total = await Order.findAll({
      attributes: [],
      include: [
        {
          model: OrderDetail,
          attributes: [[sequelize.literal("SUM(price*quantity)"), "totalAmount"]],
        },
      ],
      where: { status: { [sequelize.Op.or]: ["Approved", "Fulfilled"] } },
      raw: true,
    });
    return total;
    }

module.exports = { 
        countCustomers,
        countOrders,
        totalSales,
 };
