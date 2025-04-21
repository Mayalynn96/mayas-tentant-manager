const User = require('./User');
const Property = require('./Property');
const Unit = require('./Unit');
const Tenant = require('./Tenant');
const Bill = require('./Bill')

Property.belongsTo(User);
User.hasMany(Property);

Property.hasMany(Unit);
Unit.belongsTo(Property);
User.hasMany(Unit);
Unit.belongsTo(User);

Tenant.belongsTo(Unit);
Unit.hasMany(Tenant);
Tenant.belongsTo(User);
User.hasMany(Tenant);

Bill.belongsTo(Property);
Property.hasMany(Bill);
Bill.belongsTo(User);
User.hasMany(Bill);

module.exports = {
    User,
    Property,
    Unit,
    Tenant,
    Bill
};