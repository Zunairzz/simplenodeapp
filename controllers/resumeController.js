const ResumeData = require("../models/Resume"); // Assuming the schema file is named ResumeData.js
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
const multer = require("multer");
const path = require('path');
dotenv.config();

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads', // Folder where PDFs will be stored
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 10 * 1024 * 1024}, // 10 MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('pdf');

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only PDFs allowed!');
    }
}

// Resume controller object containing CRUD operations
const resumeController = {
    // Retrieve all resumes from the database
    async getAllResumes(req, res) {
        try {
            const resumes = await ResumeData.find();
            if (!resumes.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No resumes found'
                });
            }
            res.status(200).json({
                success: true,
                count: resumes.length,
                data: resumes
            });
        } catch (error) {
            console.error('Error fetching resumes:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching resumes',
                error: error.message
            });
        }
    },

    // Retrieve a single resume by its ID
    async getResumeById(req, res) {
        try {
            const {id} = req.params;

            // Validate ID format
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid resume ID format'
                });
            }

            const resume = await ResumeData.findById(id);
            if (!resume) {
                return res.status(404).json({
                    success: false,
                    message: 'Resume not found'
                });
            }

            res.status(200).json({
                success: true,
                data: resume
            });
        } catch (error) {
            console.error('Error fetching resume:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching resume',
                error: error.message
            });
        }
    },

    // Create a new resume
    async createResume(req, res) {
        try {
            const {name, title, phoneNo, email, experience, resume} = req.body;

            // Validate required fields
            if (!name || !title || !phoneNo || !email || !experience || !resume.url, !resume.publicId) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required including resume file',
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format',
                });
            }

            // Validate phone number format (basic example, adjust as needed)
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(phoneNo)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid phone number format',
                });
            }

            // Create new resume document
            const newResume = await ResumeData.create({
                name,
                title,
                phoneNo,
                email,
                experience,
                resume: {
                    url: resume.url,
                    publicId: resume.publicId,
                },
            });

            res.status(201).json({
                success: true,
                message: 'Resume created successfully',
                data: newResume,
            });
        } catch (error) {
            console.error('Error creating resume:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while creating resume',
                error: error.message,
            });
        }
    },

    // Update a resume by its ID with new data
    async updateResumeById(req, res) {
        try {
            const {id} = req.params;

            // Validate ID format
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid resume ID format'
                });
            }

            const updateData = {...req.body};

            // If new resume file is uploaded
            if (req.file) {
                // Get existing resume to delete old file from Cloudinary
                const existingResume = await ResumeData.findById(id);
                if (!existingResume) {
                    return res.status(404).json({
                        success: false,
                        message: 'Resume not found'
                    });
                }

                // Delete old resume from Cloudinary
                if (existingResume.resume.publicId) {
                    await cloudinary.uploader.destroy(existingResume.resume.publicId);
                }

                // Upload new resume to Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'resumes',
                    resource_type: 'raw'
                });

                updateData.resume = {
                    url: result.secure_url,
                    publicId: result.public_id
                };
            }

            const updatedResume = await ResumeData.findByIdAndUpdate(
                id,
                updateData,
                {new: true, runValidators: true}
            );

            if (!updatedResume) {
                return res.status(404).json({
                    success: false,
                    message: 'Resume not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Resume updated successfully',
                data: updatedResume
            });
        } catch (error) {
            console.error('Error updating resume:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while updating resume',
                error: error.message
            });
        }
    },

    // Delete a resume by its ID
    async deleteResumeById(req, res) {
        try {
            const {id} = req.params;

            // Validate ID format
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid resume ID format'
                });
            }

            const resume = await ResumeData.findById(id);
            if (!resume) {
                return res.status(404).json({
                    success: false,
                    message: 'Resume not found'
                });
            }

            // Delete resume file from Cloudinary
            if (resume.resume.publicId) {
                await cloudinary.uploader.destroy(resume.resume.publicId);
            }

            await ResumeData.findByIdAndDelete(id);

            res.status(200).json({
                success: true,
                message: 'Resume deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting resume:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while deleting resume',
                error: error.message
            });
        }
    },
    async uploadPdf(req, res) {
        if (!req.file) {
            return res.status(400).json({error: 'No file uploaded'});
        }

        res.status(200).json({
            message: 'PDF uploaded successfully',
            url: req.file.path,         // Cloudinary URL
            public_id: req.file.filename // IMPORTANT: Cloudinary public_id
        });
    },

    async updatePdf(req, res) {
        const {old_public_id} = req.body;

        if (!old_public_id) {
            return res.status(400).json({error: 'old_public_id is required!'});
        }

        try {
            // First, delete the old file
            await cloudinary.uploader.destroy(old_public_id, {resource_type: 'raw'});

            // New file is already uploaded by multer (multer-storage-cloudinary uploads automatically)

            res.status(200).json({
                message: 'PDF updated successfully!',
                url: req.file.path,         // new Cloudinary URL
                public_id: req.file.filename // new public_id
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Failed to update PDF', details: error.message});
        }
    }
};

module.exports = resumeController;