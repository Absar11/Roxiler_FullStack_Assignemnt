const db = require('../config/db');
const jwt = require('jsonwebtoken');

const generateToken = (id, role, email) => {
    return jwt.sign({ id, role, email }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.findUserByEmail = async (email) => {
    // Fetches password_hash for login/password verification
    const [rows] = await db.query('SELECT user_id, name, email, password_hash, role FROM users WHERE email = ?', [email]);
    return rows[0];
};

exports.findUserById = async (userId) => {
    // Does NOT fetch password_hash (sanitized)
    const [rows] = await db.query('SELECT user_id, name, email, address, role FROM users WHERE user_id = ?', [userId]);
    return rows[0];
};

exports.createNewUser = async ({ name, email, password_hash, address, role }) => {
    const sql = `
        INSERT INTO users (name, email, password_hash, address, role) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [name, email, password_hash, address, role]);
    
    return { 
        id: result.insertId, 
        role: role, 
        token: generateToken(result.insertId, role, email) 
    };
};

exports.updateUserPassword = async (userId, password_hash) => {
    const sql = `UPDATE users SET password_hash = ? WHERE user_id = ?`;
    await db.query(sql, [password_hash, userId]);
    return true;
};

exports.getDetailedUserWithRating = async (userId) => {
    const sql = `
        SELECT 
            u.user_id, u.name, u.email, u.address, u.role, 
            s.store_id, AVG(r.rating_value) AS average_store_rating
        FROM users u
        LEFT JOIN stores s ON u.user_id = s.owner_id
        LEFT JOIN ratings r ON s.store_id = r.store_id
        WHERE u.user_id = ?
        GROUP BY u.user_id, s.store_id
    `;
    const [rows] = await db.query(sql, [userId]);
    return rows[0];
};

exports.findAllUsers = async () => {
    const sql = `SELECT user_id, name, email, address, role FROM users ORDER BY role, name`;
    const [rows] = await db.query(sql);
    return rows;
};

module.exports.generateToken = generateToken;