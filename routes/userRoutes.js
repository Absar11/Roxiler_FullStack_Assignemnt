const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { passwordValidator, validate } = require('../utils/validation');

router.use(protect); 

router.put('/change-password', passwordValidator(), validate, userController.changePassword);

module.exports = router;