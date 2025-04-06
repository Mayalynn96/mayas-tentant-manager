const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Tenant extends Model{};

Tenant.init({
    fullName:{
        type: DataTypes.STRING,
        allowNull:false
    },
    moveInDate:{
        type: DataTypes.DATE,
        allowNull:false
    },
    moveOutDate:{
        type: DataTypes.DATE,
        allowNull:true
    }
}, {
    sequelize
});

module.exports = Tenant