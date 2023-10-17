const { 
  loginAdmin, 
  getAllAdmins,
  searchAdminByName , 
  getAdminByEmail,
  createNewAdmin,
  updateAdminById,
  deleteAdminById,
  restoreAdminById,
} = require('../controllers/adminController');



  const getLoginAccess = async (req, res) => {

   const { email, password } = req.body;

    try {
      const login = await loginAdmin(email, password);
      res.status(200).json(login);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  const getAdminHandler = async (req, res) => {
    const { name } = req.query;
    try {
      const results = name
        ? await searchAdminByName(name)
        : await getAllAdmins();
      res.status(200).json(results);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const searchAdminByNameHandler = async (req, res) => {

    const { name } = req.query;
    try {
      const results = name
        ? await searchAdminByName(name)
        : await getAllAdmins();
      res.status(200).json(results);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  const getAdminByEmailHandler = async (req, res) => {
    try {
      const { email } = req.params;
  
      const adminByEmail = await getAdminByEmail(email);
  
      return adminByEmail
        ? res.status(200).json(adminByEmail)
        : res.status(404).json({ message: 'Admin no encontrado.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  const createNewAdminHandler = async (req, res) => {
    try {
      const newAdmin = await createNewAdmin(req.body);
      res.status(201).json({newAdmin, message: 'Admin creado exitosamente'});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  const updateAdminByIdHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const adminData = req.body;
      await updateAdminById(id, adminData);
      res.status(204).json({message: 'Admin modificado exitosamente'});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  const deleteAdminByIdHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await deleteAdminById(id);
      res.status(204).json({message: 'Admin eliminado exitosamente'});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  const restoreAdminByIdHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await restoreAdminById(id);
      res.status(204).json({message: 'Admin restaurado exitosamente'});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }


module.exports = {
    getAdminHandler,
    getAdminByEmailHandler,
    searchAdminByNameHandler,
    createNewAdminHandler,
    getLoginAccess,
    updateAdminByIdHandler,
    deleteAdminByIdHandler,
    restoreAdminByIdHandler,
};
