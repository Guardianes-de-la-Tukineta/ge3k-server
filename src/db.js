require("dotenv").config();
const { Sequelize } = require("sequelize");

const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}`,
  {
    logging: false,
    native: false,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
  Customer,
  Order,
  OrderDetail,
  Product,
  Rating,
  Favorite,
  Category,
  Theme,
} = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Customer.hasMany(Order);
Order.belongsTo(Customer);

Order.hasMany(OrderDetail);
OrderDetail.belongsTo(Order);

Product.hasMany(OrderDetail);
OrderDetail.belongsTo(Product);

Category.hasMany(Product);
Product.belongsTo(Category);

Theme.hasMany(Product);
Product.belongsTo(Theme);

Customer.hasMany(Rating);
Rating.belongsTo(Customer);

Product.hasMany(Rating);
Rating.belongsTo(Product);

Customer.hasMany(Favorite);
Favorite.belongsTo(Customer);

Product.hasMany(Favorite);
Favorite.belongsTo(Product);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
