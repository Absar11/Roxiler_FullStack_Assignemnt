const db = require('../config/db');

exports.submitRating = async (storeId, userId, ratingValue) => {
    const existingRating = await db.query(
        'SELECT rating_id FROM ratings WHERE store_id = ? AND user_id = ?',
        [storeId, userId]
    );

    if (existingRating[0].length) {
        // Update the existing rating
        const sql = `
        UPDATE ratings SET rating_value = ?, 
        submitted_at = CURRENT_TIMESTAMP() WHERE store_id = ? AND user_id = ?`;
        await db.query(sql, [ratingValue, storeId, userId]);
        return 'modified';
    } else {
        // Insert a new rating
        const sql = `INSERT INTO ratings (store_id, user_id, rating_value) VALUES (?, ?, ?)`;
        await db.query(sql, [storeId, userId, ratingValue]);
        return 'submitted';
    }
};

exports.getAverageRatingForOwnerStore = async (ownerId) => {
    const sql = `
        SELECT AVG(r.rating_value) AS average_rating 
        FROM stores s 
        LEFT JOIN ratings r ON s.store_id = r.store_id 
        WHERE s.owner_id = ? 
        GROUP BY s.store_id
    `;
    const [rows] = await db.query(sql, [ownerId]);
    return rows[0];
};

exports.getUsersWhoRatedOwnerStore = async (ownerId) => {
    const sql = `
        SELECT 
            u.user_id, u.name, u.email, r.rating_value, r.submitted_at
        FROM ratings r
        JOIN stores s ON r.store_id = s.store_id
        JOIN users u ON r.user_id = u.user_id
        WHERE s.owner_id = ?
        ORDER BY r.submitted_at DESC
    `;
    const [rows] = await db.query(sql, [ownerId]);
    return rows;
};