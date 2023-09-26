const { findAllProducts } = require("../controllers/productsController");

const getProductsHandler = async ( req, res ) => {
    const product = req.query.name;
    try {
        const results = product ? await searchProductByName(product) : await findAllProducts();
        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getProductsHandler,
}