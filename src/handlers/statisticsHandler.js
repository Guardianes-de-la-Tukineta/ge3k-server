const {
    countCustomers,
    countOrders,
    totalSales,
} = require('../controllers/statisticController');

const getCountCustomerHandler = async (req,res) => {
   
    try {
        const customers = await countCustomers();
        res.status(200).json(customers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getCountOrdersHandler = async (req,res) => {
    try {
        const orders = await countOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }   
}

const getTotalSalesHandler = async (req,res) => {
    try {
        const total = await totalSales();
        res.status(200).json(total);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }   
}

module.exports = {
    getCountCustomerHandler,
    getCountOrdersHandler,
    getTotalSalesHandler,
};
