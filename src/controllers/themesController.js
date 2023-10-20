const { Theme, Product } = require("../db");
const { Op, Sequelize } = require("sequelize");
const { themeFormat } = require("../utils/utils");

const getAllThemes = async (active) => {
  if (active === "yes") {
    const rawGrouping = await Product.findAll({
      attributes: [[Sequelize.fn("COUNT", "id"), "products"]],
      include: [
        {
          model: Theme,
          attributes: ["name", "id"],
        },
      ],
      group: ["Theme.id", "Theme.name", "Product.ThemeId"],
    });

    const grouping = rawGrouping.map((theme) => {
      const { id, name } = theme.Theme;
      const { products } = theme.dataValues;
      return { id, name, products };
    });

    return grouping;
  }

  const themes = await Theme.findAll();
  return themes.map((theme) => themeFormat(theme));
};

const searchThemeByName = async (themeName) => {
  const results = await Theme.findAll({
    where: {
      name: {
        [Op.iLike]: `%${themeName}%`, //* Búsqueda inexacta (y tampoco distingue mayúsculas/minúsculas)
      },
    },
  });
  return results.map((result) => themeFormat(result));
};

const getThemeById = async (id) => {
  const theme = await Theme.findByPk(id);
  return theme ? themeFormat(theme) : null;
};
const createNewTheme = async (theme) => {
  const { name } = theme;

  const newTheme = await Theme.create({
    name,
  });

  return newTheme;
};

const bulkCreateNewTheme = async (themes) => {
  await Theme.bulkCreate(themes);
};

const updateThemeById = async (id, themeData) => {
  const { name } = themeData;

  const theme = await Theme.findByPk(id);

  if (!theme) {
    return null;
  }
  if (name) {
    theme.name = name;
  }
  await theme.save();
  return theme;
};

const deleteThemeById = async (id) => {
  const theme = await Theme.findByPk(id);
  if (!theme) {
    throw new Error("themeo no encontrado");
  }
  await theme.destroy();
};

module.exports = {
  getAllThemes,
  searchThemeByName,
  getThemeById,
  createNewTheme,
  bulkCreateNewTheme,
  updateThemeById,
  deleteThemeById,
};
