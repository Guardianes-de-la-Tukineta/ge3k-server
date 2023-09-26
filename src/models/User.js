const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define("User", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [10, 50], 
              },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone : {
            type: DataTypes.INTEGER,
            allowNull : false,
        
       
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {   //premium, rookie or invite
            type: DataTypes.STRING,
            allowNull: false
        },
    },
   )
};