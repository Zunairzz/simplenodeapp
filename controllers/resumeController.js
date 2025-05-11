const ResumeData = require("../models/Resume"); // Assuming the schema file is named ResumeData.js
const mongoose = require('mongoose');
const validator = require('validator');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
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
        try {
            const resumes = await ResumeData.find();
            if (!resumes.length) {
                return res.status(200).json({
                    success: false,
                    message: 'No resumes found',
                    data: resumes
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
            const {name, title, phoneNo, email, experience, document, image} = req.body;

            // Validate required fields
            const missingFields = [];
            if (!name) missingFields.push('name');
            if (!title) missingFields.push('title');
            if (!phoneNo) missingFields.push('phoneNo');
            if (!email) missingFields.push('email');
            if (!experience) missingFields.push('experience');

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`,
                });
            }

            // Validate input formats
            if (!validator.isLength(name.trim(), {min: 2, max: 100})) {
                return res.status(400).json({
                    success: false,
                    message: 'Name must be between 2 and 100 characters',
                });
            }
            if (!validator.isLength(title.trim(), {min: 2, max: 100})) {
                return res.status(400).json({
                    success: false,
                    message: 'Title must be between 2 and 100 characters',
                });
            }
            if (!validator.isMobilePhone(phoneNo.trim(), 'any', {strictMode: true})) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid phone number format',
                });
            }
            if (!validator.isEmail(email.trim())) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format',
                });
            }
            if (!validator.isLength(experience.trim(), {min: 10, max: 5000})) {
                return res.status(400).json({
                    success: false,
                    message: 'Experience must be between 10 and 5000 characters',
                });
            }

            // Validate document if provided
            if (document) {
                if (!document.url || !validator.isURL(document.url.trim())) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid document URL',
                    });
                }
                if (!document.publicId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Document publicId is required if document is provided',
                    });
                }
            }

            // Validate image if provided
            if (image) {
                if (!image.url || !validator.isURL(image.url.trim())) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid image URL',
                    });
                }
                if (!image.publicId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Image publicId is required if image is provided',
                    });
                }
            }

            // Sanitize inputs to prevent XSS
            const sanitizedData = {
                name: validator.escape(name.trim()),
                title: validator.escape(title.trim()),
                phoneNo: validator.escape(phoneNo.trim()),
                email: validator.normalizeEmail(email.trim()),
                experience: validator.escape(experience.trim()),
                ...(document && {
                    document: {
                        url: document.url.trim(),
                        publicId: document.publicId.trim(),
                    },
                }),
                ...(image && {
                    image: {
                        url: image.url.trim(),
                        publicId: image.publicId.trim(),
                    },
                }),
            };

            // Create a new resume document
            const newResume = await ResumeData.create(sanitizedData);

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

            // Delete a resume file from Cloudinary if it exists
            if (resume.document && resume.document.publicId) {
                await cloudinary.uploader.destroy(resume.document.publicId);
            }

            // Delete an image file from Cloudinary if it exists
            if (resume.image && resume.image.publicId) {
                await cloudinary.uploader.destroy(resume.image.publicId);
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
        try {
            const filePath = req.file.path;

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(filePath, {
                resource_type: 'raw', // use 'raw' for PDF/doc files
                folder: 'resumes'
            });

            // Remove a local file
            fs.unlinkSync(filePath);

            return res.json({
                success: true,
                url: result.secure_url,
                public_id: result.public_id
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Upload failed',
                error: error.message
            });
        }
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
    },

    async deleteResources(req, res) {
        try {
            const {publicId} = req.body;

            console.log(publicId);
            // Validate publicId
            if (!publicId) {
                return res.status(400).json({
                    success: false,
                    message: 'Public ID is required'
                });
            }

            // Delete image or document from Cloudinary
            const result = await cloudinary.uploader.destroy(publicId);

            if (result.result !== 'ok') {
                return res.status(404).json({
                    success: false,
                    message: 'Resource not found in Cloudinary'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Resource deleted successfully',
                data: result
            });
        } catch (error) {
            console.error('Error deleting resource from Cloudinary:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while deleting image',
                error: error.message
            });
        }
    }
};

module.exports = resumeController;