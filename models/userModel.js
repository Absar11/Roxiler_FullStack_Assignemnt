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
