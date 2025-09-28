const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

exports.changePassword = async (req, res) => {
    const { current_password, password: new_password } = req.body;
    const userId = req.user.id;
    
    if (!current_password) { 
        return res.status(400).json({
            message: 'Current password is required to verify identity.' 
        }); 
    }

    try {
        const user = await userModel.findUserByEmail(req.user.email); 

        if (!user || !(await bcrypt.compare(current_password, user.password_hash))) {
            return res.status(401).json({ 
                message: 'Incorrect current password.' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const new_password_hash = await bcrypt.hash(new_password, salt);

        await userModel.updateUserPassword(userId, new_password_hash);

        res.json({
            message: 'Password updated successfully. Please log in again.' 
        });
        
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ 
            message: 'Failed to update password due to a server error.' 
        });
    }
};