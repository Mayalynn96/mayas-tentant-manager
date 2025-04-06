const User = require('./User');
const Property = require('./Property');
const Unit = require('./Unit');

Property.belongsTo(User);
User.hasMany(Property);

Property.hasMany(Unit);
Unit.belongsTo(Property);
User.hasMany(Unit);
Unit.belongsTo(User);

module.exports = {
    User,
    Property,
    Unit
};