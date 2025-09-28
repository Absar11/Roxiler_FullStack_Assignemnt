const db = require('../config/db');


exports.createNewUser = async ({ name, email, password_hash, address, role = 'NormalUser' }) => {
    const sql = `
        INSERT INTO users (name, email, password_hash, address, role) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [name, email, password_hash, address, role]);
    
    return { id: result.insertId, name, email, role };
};

exports.findUserByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

exports.findUserById = async (userId) => {
    const [rows] = await db.query(
        'SELECT user_id, name, email, address, password_hash, role FROM users WHERE user_id = ?',
        [userId]
    );
    return rows[0];
};


exports.updateUserPassword = async (userId, password_hash) => {
    const sql = `UPDATE users SET password_hash = ? WHERE user_id = ?`;
    await db.query(sql, [password_hash, userId]);
    return true;
};

