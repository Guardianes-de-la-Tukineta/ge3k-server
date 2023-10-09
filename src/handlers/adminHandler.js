const {loginAdmin} = require('../controllers/adminController');

const getAdminByEmailHandler = async (req, res) => {
    try {
      const { email } = req.params;
  
      const adminByEmail = await loginAdmin(email);
  
      return adminByEmail
        ? res.status(200).json(adminByEmail)
        : res.status(404).json({ message: 'Admin no encontrado.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
    getAdminByEmailHandler
};
