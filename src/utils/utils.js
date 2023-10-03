const productFormat = (product) => {
  const {
    id,
    name,
    price,
    image,
    description,
    stock,
    discount,
    Category: { name: category },
    Theme: { name: theme },
  } = product;

  return {
    id,
    name,
    price,
    image,
    description,
    stock,
    discount,
    category,
    theme,
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
