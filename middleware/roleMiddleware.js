const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                message: 'Authentication required.' 
            });
        }

        const userRole = req.user.role;
        
        if (roles.length > 0 && !roles.includes(userRole)) {
            return res.status(403).json({ 
                message: `Forbidden: Access restricted to ${roles.join(' or ')}.` 
            });
        }
        
        next();
    };
};

module.exports = { authorize };