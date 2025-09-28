const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { userValidation, storeValidation, validate } = require('../utils/validation');

// All routes require Admin role
router.use(protect, authorize('Admin'));

// Dashboard
router.get('/dashboard-stats', adminController.getDashboardStats);

// User Management
router.post('/users', userValidation, validate, adminController.createNewUser);
router.get('/users', adminController.listAllUsers);
router.get('/users/:id', adminController.getUserDetails);

// Store Management
router.post('/stores', storeValidation, validate, adminController.createNewStore);
router.get('/stores', adminController.listAllStores);

module.exports = router;