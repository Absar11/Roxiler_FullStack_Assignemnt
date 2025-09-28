const { body, validationResult } = require('express-validator');

const passwordValidator = () => 
    body('password')
        .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 characters.')
        .matches(/[A-Z]/).withMessage('Password must include at least one uppercase letter.')
        .matches(/[!@#$%^&*]/).withMessage('Password must include at least one special character.');

const userValidation = [
    body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters.'),
    body('email').isEmail().withMessage('Must be a valid email format.'),
    passwordValidator(),
    body('address').isLength({ max: 400 }).withMessage('Address must be at most 400 characters.')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
};

const storeValidation = [
    body('name').notEmpty().withMessage('Store name is required.'),
    body('email').isEmail().withMessage('Store email must be valid.'),
    body('address').isLength({ max: 400 }).withMessage('Store address must be at most 400 characters.'),
    body('owner_id').isInt().withMessage('Owner ID must be an integer.')
];

const ratingValidation = [
    body('rating_value').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.')
];

module.exports = { userValidation, passwordValidator, validate, storeValidation, ratingValidation };
