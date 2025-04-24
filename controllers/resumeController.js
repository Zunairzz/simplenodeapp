const Project = require("../models/Project");
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Resume controller object containing CRUD operations
const resumeController = {
    // Retrieve all resumes from the database
    async getAllResumes(req, res) {
        console.log('Fetching all resumes');
    },

    // Retrieve a single resume by its ID
    async getResumeById(req, res) {
        console.log(`Fetching resume with ID: ${req.params.id}`);
    },

    // Update a resume by its ID with new data
    async updateResumeById(req, res) {
        console.log(`Updating resume with ID: ${req.params.id}`);
    },

    // Delete a resume by its ID
    async deleteResumeById(req, res) {
        console.log(`Deleting resume with ID: ${req.params.id}`);
    }
}