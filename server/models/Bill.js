const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Bill extends Model{};

Bill.init({
    category:{
        type: DataTypes.STRING,
        allowNull:false
    },
    subCategory:{
        type: DataTypes.STRING,
        allowNull:false
    },
    company:{
        type: DataTypes.STRING,
        allowNull:false
    },
    date:{
        type: DataTypes.DATEONLY,
        allowNull:false
    },
    amount:{
        type: DataTypes.INTEGER,
        allowNull:false
    }
}, {
    sequelize
});

module.exports = Bill