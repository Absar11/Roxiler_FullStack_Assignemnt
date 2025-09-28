const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const protect = async (req, res, next) => {
    console.log("Auth Header:", req.headers.authorization); // Debug log

    let token;

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer ')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await userModel.findUserById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user; 
            return next();
        } catch (error) {
            console.error('Auth error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    return res.status(401).json({ message: 'Not authorized, no token provided.' });
};

module.exports = { protect };
