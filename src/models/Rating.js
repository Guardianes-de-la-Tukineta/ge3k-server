const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Rating",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      Comment: {
        type: DataTypes.TEXT,
      },
    },
    {
      paranoid: true,
    }
  );
};
