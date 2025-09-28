const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

// --- Normal User Signup 
exports.register = async (req, res) => {
    const { name, email, password, address } = req.body;
    try {
        if (await userModel.findUserByEmail(email)) { 
            return res.status(409).json({
                 message: 'Email already registered.' 
                }); 
            }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const user = await userModel.createNewUser({ name, email, password_hash, address, role: 'NormalUser' });
        res.status(201).json({ 
            id: user.id, role: 
            user.role, token: 
            user.token 
        });
    } catch (error) { 
        console.error('Registration error:', error); 
        res.status(500).json({ 
            message: 'Server error during registration.' 
        }); }
};

// --- All Roles Login 
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            message: 'Email and password required.' 
        });
    }

    try {
        let user = await userModel.findUserByEmail(email);

        if (!user) {
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                console.log(`\n Initializing Admin user: ${email}`);
                
                const salt = await bcrypt.genSalt(10);
                const password_hash = await bcrypt.hash(password, salt);
                
                const newUserDetails = { 
                    name: 'System Administrator', 
                    email: email, 
                    password_hash: password_hash, 
                    address: 'Default Admin Address', 
                    role: 'Admin' 
                };
                
                const createdUser = await userModel.createNewUser(newUserDetails);
                
                user = await userModel.findUserByEmail(email); 
                
                console.log(`Admin added successfully.`);
            } else {
                return res.status(401).json({ 
                    message: 'Invalid credentials.' 
                });
            }
        }

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            const token = userModel.generateToken(user.user_id, user.role, user.email);
            
            res.json({
                id: user.user_id,
                name: user.name,
                role: user.role,
                token: token,
            });
        } else {
            res.status(401).json({ 
                message: 'Invalid credentials.' 
            });
        }
    } catch (error) {
        console.error('Login/Admin Init Error:', error);
        res.status(500).json({ 
            message: 'Server error during login.' 
        });
    }
};