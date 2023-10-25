const sequelize = require('sequelize');
const { Customer, Order, OrderDetail } = require('../db.js'); 

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
      const total = await OrderDetail.findAll({
        attributes: [
            [sequelize.fn('SUM', sequelize.literal('price * quantity')), 'totalSales'],
        ],
    });
    return total;
    
}


module.exports = { 
    countCustomers,
    countOrders,
    totalSales,
 };
