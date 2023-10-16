const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 20],
        },
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 20],
        },
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stripeOrderId: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Approved", "Cancelled"),
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );
};
