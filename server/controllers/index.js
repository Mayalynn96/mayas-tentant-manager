const express = require('express');
const router = express.Router();

const PropertyRoutes = require('./propertyController');
router.use('/api/Properties', PropertyRoutes);

const UnitRoutes = require('./unitController');
router.use('/api/Units', UnitRoutes);

const UserRoutes = require('./userController');
router.use('/api/Users', UserRoutes);

const TenantRoutes = require('./tenantController');
router.use('/api/Tenants', TenantRoutes);

const BillRoutes = require('./billController');
router.use('/api/Bills', BillRoutes);

module.exports = router;