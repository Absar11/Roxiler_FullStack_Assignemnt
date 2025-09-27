const express = require('express');
const dotenv = require('dotenv');

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

require('./config/db'); 


app.use(express.json()); 


app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});