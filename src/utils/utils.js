const productFormat = (product) => {
  const {
    id,
    name,
    price,
    image,
    description,
    stock,
    discount,
    Category: { name: categoryName },
    Theme: { name: themeName },
  } = product;

  return {
    id,
    name,
    price,
    image,
    description,
    stock,
    discount,
    categoryName,
    themeName,
  };
};

const categoryFormat = (category) => {
  const { id, name } = category;
  return { id, name };
};

const themeFormat = (theme) => {
  const { id, name } = theme;
  return { id, name };
};

module.exports = { productFormat, categoryFormat, themeFormat };
