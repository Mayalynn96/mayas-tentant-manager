const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model{};

User.init({
    email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            len: [8,20]
        }
    },
    fullName:{
        type: DataTypes.STRING
    },
    adress:{
        type: DataTypes.STRING
    },
    payementMethode:{
        type: DataTypes.STRING
    }
},{
    sequelize,
    hooks:{
        beforeCreate:userObj => {
            userObj.password = bcrypt.hashSync(userObj.password,4);
        }
    }
}, {
    sequelize
});

module.exports = User