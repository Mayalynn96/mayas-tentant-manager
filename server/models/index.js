const User = require('./User');
const Property = require('./Property');

Property.belongsTo(User);
User.hasMany(Property);

module.exports = {
    User,
    Property
};