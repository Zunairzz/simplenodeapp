const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const {urlencoded} = require("body-parser");
const app = express();
const userRoutes = require('./routes/userRoutes'); // Ensure correct path
const projectRoutes = require('./routes/projectRoutes'); // Ensure correct path
dotenv.config();

// Middleware
app.use(cors());
app.use(urlencoded({extended: true}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/project', projectRoutes);

module.exports = app;