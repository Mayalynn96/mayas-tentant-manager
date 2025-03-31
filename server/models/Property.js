const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Property extends Model{};

Property.init({
    address:{
        type: DataTypes.STRING,
        allowNull:false
    },
    city:{
        type: DataTypes.STRING,
        allowNull:false
    },
    zipCode:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    country:{
        type: DataTypes.STRING,
        allowNull:false
    },
    nbrOfAp:{
        type: DataTypes.INTEGER,
        allowNull:false
    }
}, {
    sequelize
});

module.exports = Property