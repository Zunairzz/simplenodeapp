const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    async register(req, res) {
        const {name, email, password} = req.body;

        try {
            const userExists = await User.findOne({email});
            if (userExists) return res.status(400).json({message: 'User already exists'});

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            const user = await User.create({name, email, password: hashed});

            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

            res.status(201).json({token, user: {id: user._id, name: user.name, email: user.email}});
        } catch (err) {
            res.status(500).json({message: 'Server error'});
        }
    },

    async login(req, res) {
        const {email, password} = req.body;

        try {
            const user = await User.findOne({email});
            if (!user) return res.status(400).json({message: 'Invalid credentials'});

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({message: 'Invalid credentials'});

            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

            res.json({token, user: {id: user._id, name: user.name, email: user.email}});
        } catch (err) {
            res.status(500).json({message: 'Server error'});
        }
    },

    async getProfiles(req, res) {
        try {
            const users = await User.find().select('-password');
            res.json(users);
        } catch (err) {
            res.status(500).json({message: 'Server error'});
        }
    },

    async deleteUser(req, res) {
        try {
            // Get user ID from params or authenticated user
            const userId = req.body.id || req.user.id;

            // Find and delete the user
            const user = await User.findByIdAndDelete(userId);

            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            res.json({message: 'User deleted successfully'});
        } catch (err) {
            res.status(500).json({message: 'Server error'});
        }
    }
}


module.exports = authController;
