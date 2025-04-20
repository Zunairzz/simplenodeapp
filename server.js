const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies

// Routes
const userRoutes = require('./routes/userRoutes'); // Ensure correct path
const projectRoutes = require('./routes/projectRoutes');

app.get('/', (req, res) => {
    res.json({message: 'Welcome to my Node.js app!'});
});

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/project', projectRoutes);

const authController = require('/controllers/authController');
const {REGISTER_URL, LOGIN_URL, GET_ALL_USER_URL, DELETE_USER_URL} = require("/util/Constants");

app.post(REGISTER_URL, authController.register);
app.post(LOGIN_URL, authController.login);
app.get(GET_ALL_USER_URL, authController.getProfiles);
app.delete(DELETE_USER_URL, authController.deleteUser);


// Connect MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Serve static files in non-production
// if (process.env.NODE_ENV === 'PRODUCTION') {
//     app.use(express.static(path.join(__dirname, '../frontend/build')));
//     app.get('*', (req, res) =>
//         res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'))
//     );
// }

// Error handling middleware (optional, for better debugging)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3022;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;