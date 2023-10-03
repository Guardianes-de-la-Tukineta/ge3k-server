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

module.exports = { productFormat };
