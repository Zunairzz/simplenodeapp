const Project = require("../models/Project");
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

// Configure Cloudinary (ensure these are set in your .env file)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const projectController = {
    async addProject(req, res) {
        try {
            console.log("Add project request")
            const {title, description, technologies, githubUrl, image, publicId} = req.body;

            // Basic validation
            if (!title || !description || !githubUrl || !technologies.length) {
                return res.status(400).json({error: "Missing required fields"});
            }

            const project = new Project({
                title,
                description,
                technologies,
                githubUrl,
                image, // Save image URL
                publicId
            });

            await project.save();
            res.status(201).json(project);
        } catch (err) {
            res.status(400).json({error: err.message});
        }
    },

    async getAllProjects(req, res) {
        try {
            const projects = await Project.find();
            res.json(projects);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    },

    async deleteProject(req, res) {
        try {
            const projectId = req.params.id;

            // Validate project ID
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({message: 'Invalid project ID'});
            }

            // Find project
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({message: 'Project not found'});
            }

            try {
                // Delete image from Cloudinary if it exists
                if (project.publicId) {
                    await cloudinary.uploader.destroy(project.publicId);
                }
            } catch (error) {
                return res.status(500).json({error: error.message});
            }

            // Delete project from database
            await Project.findByIdAndDelete(projectId);

            res.status(200).json({
                message: 'Project and associated image deleted successfully',
                projectId: projectId
            });
        } catch (error) {
            console.error('Error deleting project and image:', error);
            res.status(500).json({message: 'Server error while deleting project and image'});
        }
    },

    async getProjectById(req, res) {
        try {
            const projectId = req.params.id;

            // Validate project ID
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({message: 'Invalid project ID'});
            }

            // Find project
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({message: 'Project not found'});
            }

            res.status(200).json({
                message: 'Project retrieved successfully',
                project: {
                    _id: project._id,
                    title: project.title,
                    description: project.description,
                    technologies: project.technologies,
                    githubUrl: project.githubUrl,
                    image: project.image,
                    publicId: project.publicId
                }
            });
        } catch (error) {
            console.error('Error retrieving project:', error);
            res.status(500).json({message: 'Server error while retrieving project'});
        }
    },

    async updateProject(req, res) {
        try {
            const projectId = req.params.id;
            const {title, description, technologies, githubUrl} = req.body;

            // Validate project ID
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({message: "Invalid project ID"});
            }

            // Find project
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({message: "Project not found"});
            }

            // Update project fields
            project.title = title || project.title;
            project.description = description || project.description;
            project.technologies = technologies || project.technologies
            project.githubUrl = githubUrl || project.githubUrl;

            // Handle image update if provided
            if (req.body.image && req.body.publicId) {
                // Delete old image from Cloudinary if it exists
                if (project.publicId) {
                    await cloudinary.uploader.destroy(project.publicId);
                }
                project.image = req.body.image;
                project.publicId = req.body.publicId;
            }

            // Save updated project
            const updatedProject = await project.save();

            res.status(200).json({
                message: "Project updated successfully",
                data: updatedProject,
            });
        } catch (error) {
            console.error("Error updating project:", error);
            res.status(500).json({message: "Server error while updating project"});
        }
    }
}

module.exports = projectController;