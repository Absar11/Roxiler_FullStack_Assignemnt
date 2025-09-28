const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db'); 
const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;


// 2. Middleware
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json()); 

// 3. Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');

// 4. Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);

// Global Error Handler
app.use((err, req, res, next) => { 
    console.error('Global Error:', err.stack); 
    res.status(500).json({ message: 'Server error: Something went wrong.' }); 
});

app.listen(PORT, () => { console.log(`🚀 Server running on port ${PORT}`); });