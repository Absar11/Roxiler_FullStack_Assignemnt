const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { userValidation, validate } = require('../utils/validation');

router.post('/register', userValidation, validate, authController.register);

module.exports = router;
