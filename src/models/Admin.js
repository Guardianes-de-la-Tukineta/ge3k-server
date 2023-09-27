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
            type: DataTypes.STRING(64),
            allowNull: false,
            validate : {
                is: /^[0-9a-f]{64}$/i
            },
            set(value) {
                //esto es para que no se guarde en texto plano; se guarda el hash;
               //hay que chequear si funciona
               //https://sequelize.org/docs/v6/core-concepts/getters-setters-virtuals/#setters
                this.setDataValue('password', hash(value));
              }

      },  
     
    },
        {
            paranoid: true,
            timestamps: true,
        }
    );
};