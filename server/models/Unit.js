const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Unit extends Model{};

Unit.init({
    unitNbr:{
        type: DataTypes.STRING,
        allowNull:false
    },
    size:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    floor:{
        type: DataTypes.STRING,
        allowNull:false
    }
}, {
    sequelize
});

module.exports = Unit