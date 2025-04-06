const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Tenant extends Model{};

Tenant.init({
    fullName:{
        type: DataTypes.STRING,
        allowNull:false
    },
    moveInDate:{
        type: DataTypes.DATEONLY,
        allowNull:false
    },
    moveOutDate:{
        type: DataTypes.DATEONLY,
        allowNull:true
    }
}, {
    sequelize
});

module.exports = Tenant