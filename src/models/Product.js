const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define("Product", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category1 : {   //geek, movies, anime, wear
            type: DataTypes.STRING,
            allowNull : true,
        
        },
        category2 : {   //geek, movies, anime, wear
            type: DataTypes.STRING,
            allowNull : true,
        
        },
        category3 : {   //geek, movies, anime, wear
            type: DataTypes.STRING,
            allowNull : true,
        
        },
        stock: {  //units available on inventary
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
   )
};