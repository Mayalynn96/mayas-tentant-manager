const express = require('express');
const router = express.Router();

const UserRoutes = require('./userController')
router.use('/api/Users', UserRoutes);

const PropertyRoutes = require('./propertyController')
router.use('/api/Properties', PropertyRoutes);

module.exports = router;