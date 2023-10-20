const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "OrderDetail",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      paranoid: true,
    }
  );
};
