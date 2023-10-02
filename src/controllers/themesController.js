const { Theme } = require('../db');
const { Op } = require('sequelize');

const getAllThemes = async () => {

    const themes = await Theme.findAll();
    return themes;

};

const searchThemeByName = async (themeName) => {
  console.log(themeName);
    const results = await Theme.findAll({
      where: {
        name: {
          [Op.iLike]: `%${themeName}%`, //* Búsqueda inexacta (y tampoco distingue mayúsculas/minúsculas)
        },
      },
    });
    return results;
};

const getThemeById = async (id) => {

    const theme = await Theme.findByPk(id);
    return theme ? theme : null;

};
const createNewTheme = async (theme) => { 
     const {
       name
     } = theme;


     const newTheme = await Theme.create({
       name,
     });

     return newTheme;
    
}

const bulkCreateNewTheme=async (themes) => {
  Theme.bulkCreate(themes)
}

module.exports = { getAllThemes, searchThemeByName, getThemeById, createNewTheme, bulkCreateNewTheme };