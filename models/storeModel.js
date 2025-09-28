const db = require('../config/db');

exports.findAllStoresWithRatings = async ({ search = '', sort = 's.name ASC', userId = null }) => {
    let whereClause = 'WHERE 1=1';
    const params = [userId];

    if (search) {
        whereClause += ' AND (s.name LIKE ? OR s.address LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    const sql = `
        SELECT 
            s.store_id, s.name, s.address, s.email, 
            AVG(r_all.rating_value) AS overall_rating,
            (SELECT rating_value FROM ratings r_user WHERE r_user.store_id = s.store_id AND r_user.user_id = ?) AS user_submitted_rating
        FROM stores s
        LEFT JOIN ratings r_all ON s.store_id = r_all.store_id
        ${whereClause}
        GROUP BY s.store_id, s.name, s.address, s.email
        ORDER BY ${sort}
    `;
    
    const [rows] = await db.query(sql, params);
    return rows;
};

exports.findAllStores = async () => {
    const sql = `
        SELECT s.store_id, s.name, s.email, s.address, AVG(r.rating_value) AS rating 
        FROM stores s 
        LEFT JOIN ratings r ON s.store_id = r.store_id 
        GROUP BY s.store_id ORDER BY s.name
    `;
    const [rows] = await db.query(sql);
    return rows;
};

exports.createNewStore = async ({ owner_id, name, email, address }) => {
    const sql = `
        INSERT INTO stores (owner_id, name, email, address) 
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [owner_id, name, email, address]);
    return result.insertId;
};