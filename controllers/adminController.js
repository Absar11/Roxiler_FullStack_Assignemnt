const db = require('../config/db');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const storeModel = require('../models/storeModel');

exports.getDashboardStats = async (req, res) => {
    try {
        const [userCount] = await db.query('SELECT COUNT(*) AS count FROM users');
        const [storeCount] = await db.query('SELECT COUNT(*) AS count FROM stores');
        const [ratingCount] = await db.query('SELECT COUNT(*) AS count FROM ratings');
        res.json({ totalUsers: userCount[0].count, totalStores: storeCount[0].count, totalRatings: ratingCount[0].count });
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error fetching stats.' }); }
};

exports.createNewUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;
    if (!['Admin', 'NormalUser', 'StoreOwner'].includes(role)) { return res.status(400).json({ message: 'Invalid role.' }); }
    try {
        if (await userModel.findUserByEmail(email)) { return res.status(409).json({ message: 'Email already exists.' }); }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        await userModel.createNewUser({ name, email, password_hash, address, role });
        res.status(201).json({ message: `${role} created successfully.` });
    } catch (error) { console.error(error); res.status(500).json({ message: 'Failed to create user.' }); }
};

exports.createNewStore = async (req, res) => {
    const { owner_id, name, email, address } = req.body;
    try {
        const owner = await userModel.findUserById(owner_id);
        if (!owner || owner.role !== 'StoreOwner') { return res.status(400).json({ message: 'Owner must be a valid StoreOwner user.' }); }
        await storeModel.createNewStore({ owner_id, name, email, address });
        res.status(201).json({ message: 'Store created successfully.' });
    } catch (error) { console.error(error); res.status(500).json({ message: 'Failed to create store (Owner might already have a store).' }); }
};

exports.listAllUsers = async (req, res) => {
    try {
        const users = await userModel.findAllUsers();
        res.json(users);
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error fetching user list.' }); }
};

exports.listAllStores = async (req, res) => {
    try {
        const stores = await storeModel.findAllStores();
        res.json(stores);
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error fetching store list.' }); }
};

exports.getUserDetails = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userModel.getDetailedUserWithRating(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user);
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error fetching user details.' }); }
};