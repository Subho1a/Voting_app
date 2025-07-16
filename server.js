const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./db');

// Middleware
app.use(express.json()); // ✅ Built-in body parser

// Test route
app.get('/', (req, res) => {
    res.send('Welcome to voting app!');
});

//middleware for JWT authentication


// Routes
const userRoutes = require('./route/user_route.js');
const candidateRoutes = require('./route/candidate_route.js');

// Use routes
app.use('/candidates', candidateRoutes);
app.use('/users', userRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
