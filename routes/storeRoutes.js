const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { ratingValidation, validate } = require('../utils/validation');

// Normal User/Admin store listing
router.get('/', protect, storeController.listStores);

// Rating Submission/Modification
router.post('/ratings', protect, authorize('NormalUser'), ratingValidation, validate, storeController.submitRating);
router.put('/ratings', protect, authorize('NormalUser'), ratingValidation, validate, storeController.submitRating); // Reuses the upsert logic

// Store Owner Dashboard Data
router.get('/owner/average-rating', protect, authorize('StoreOwner'), storeController.getAverageRating);
router.get('/owner/ratings', protect, authorize('StoreOwner'), storeController.getUsersWhoRatedStore);

module.exports = router;