const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { userValidation, validate, passwordValidator } = require('../utils/validation');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', userValidation, validate, authController.register);
router.post('/login', authController.login);
router.put('/update-password', protect, authController.updatePassword);


module.exports = router;
