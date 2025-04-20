const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const { urlencoded } = require('body-parser');
const app = express();

const userRoutes = require('./routes/userRoutes'); // Ensure correct path
const projectRoutes = require('./routes/projectRoutes'); // Ensure correct path

dotenv.config();

// Middleware
app.use(cors());
console.log('CORS enabled.');

app.use(urlencoded({ extended: true }));
console.log('Body-parser (urlencoded) middleware configured.');

app.use(express.json());
console.log('Express JSON parser middleware configured.');

// Routes
app.use('/api/users', (req, res, next) => {
    console.log(`[${new Date().toISOString()}] /api/users route accessed`);
    next();
}, userRoutes);

app.use('/api/project', (req, res, next) => {
    console.log(`[${new Date().toISOString()}] /api/project route accessed`);
    next();
}, projectRoutes);

console.log('Routes have been set up.');

module.exports = app;
