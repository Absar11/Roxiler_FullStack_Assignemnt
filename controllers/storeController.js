const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');

exports.listStores = async (req, res) => {
    const { search = '', sort = 'name ASC' } = req.query; 
    const userId = req.user ? req.user.id : null; 

    if (!userId) { return res.status(401).json({ message: 'Authentication required to view stores.' }); }

    try {
        const stores = await storeModel.findAllStoresWithRatings({ search, sort, userId });
        res.json(stores);
    } catch (error) {
        console.error('Store listing error:', error);
        res.status(500).json({ message: 'Error fetching stores.' });
    }
};

exports.submitRating = async (req, res) => {
    const { store_id, rating_value } = req.body;
    const userId = req.user.id;
    
    if (!store_id) return res.status(400).json({ message: 'Store ID is required.' });

    try {
        const status = await ratingModel.submitRating(store_id, userId, rating_value);
        res.status(status === 'submitted' ? 201 : 200).json({ message: `Rating ${status} successfully.` });
    } catch (error) {
        console.error('Rating submission error:', error);
        res.status(500).json({ message: 'Failed to submit/modify rating.' });
    }
};

// Store Owner Functions
exports.getAverageRating = async (req, res) => {
    const ownerId = req.user.id;
    try {
        const result = await ratingModel.getAverageRatingForOwnerStore(ownerId);
        res.json(result || { average_rating: 0 });
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error fetching average rating.' }); }
};

exports.getUsersWhoRatedStore = async (req, res) => {
    const ownerId = req.user.id;
    try {
        const ratings = await ratingModel.getUsersWhoRatedOwnerStore(ownerId);
        res.json(ratings);
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error fetching rating users.' }); }
};