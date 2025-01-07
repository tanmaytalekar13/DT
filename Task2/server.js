const express = require('express');
const cors = require('cors');
const { connectToDB } = require('./src/utils/db');
const nudgeRoutes = require('./src/router/nudgeRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/nudges', nudgeRoutes);

// Start server after DB connection
connectToDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to database:', error);
});
