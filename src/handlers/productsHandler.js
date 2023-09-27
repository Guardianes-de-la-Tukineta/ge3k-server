const { getAllProducts, searchProductByName } = require("../controllers/productsController");

const getProductsHandler = async ( req, res ) => {
    const {name} = req.query;
    try {
        const results = name ? await searchProductByName(name) : await getAllProducts();
        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getProductsHandler,
}