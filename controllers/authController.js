const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
require("dotenv").config;

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: errors.array()[0].msg 
        });
    }

    const { name, email, password, address } = req.body;

    try {
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ 
                message: 'Email already registered.' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const user = await userModel.createNewUser({
            name,
            email,
            password_hash,
            address,
            role: 'NormalUser'
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: "User registered successfully!"
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Server error.' 
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            message: 'Please provide email and password.' 
        });
    }

    try {
        const user = await userModel.findUserByEmail(email);

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            const token = generateToken(user.user_id, user.role);
            
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
        console.error('Login error:', error);
        res.status(500).json({
             message: 'Server error.' 
            });
    }
};
