const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Admin', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 150],
        },
      },
        
      surname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              len: [3, 150],
            },

      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },

      },  

        {
            paranoid: true,
            timestamps: true,
        }
    );
};