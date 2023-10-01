const {
    getAllThemes,
    searchThemeByName,
    createNewTheme,
    getThemeById,
  } = require('../controllers/themesController');
  
  const getThemesHandler = async (req, res) => {
    const { name } = req.query;
    try {
      const results = name
        ? await searchThemeByName(name)
        : await getAllThemes();
      res.status(200).json(results);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const createThemeHandler = async (req, res) => {
    try {
      const themeData = req.body;
  
      const newTheme = await createNewTheme(themeData);
  
      return res.status(201).json({
        message: 'Cliente creado exitosamente',
        themeId: newTheme.id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  };
  const getThemeByIdHandler = async (req, res) => { 
    try {
      const { id } = req.params;
  
      const themeById = await getThemeById(id);
  
      return themeById
        ? res.status(200).json(themeById)
        : res.status(404).json({ message: 'Theme no encontrado.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
  
  module.exports = {
    getThemesHandler,
    createThemeHandler,
    getThemeByIdHandler,
  };
  