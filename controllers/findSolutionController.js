// Import required dependencies
const mongoose = require('mongoose');
const FindSolution = require('../models/FindSolution');

// Controller object to handle CRUD operations for the FindSolution model
const findSolutionController = {
    // Add a new problem to the database
    // Expects 'question' and 'answer' in the request body
    async addProblem(req, res) {
        console.log('Add problem request received');
        try {
            const { question, answer } = req.body;

            // Validate input fields
            if (!question || !answer) {
                return res.status(400).json({
                    success: false,
                    error: 'Question and answer are required',
                });
            }

            // Create and save new problem
            const problem = new FindSolution({ question, answer });
            await problem.save();

            // Return success response
            res.status(201).json({
                success: true,
                message: 'Problem created successfully',
                data: problem,
            });
        } catch (error) {
            // Return error response
            res.status(500).json({
                success: false,
                error: 'Server error',
                details: error.message,
            });
        }
    },

    // Retrieve a single problem by ID
    // Expects 'id' in the URL parameters
    async getProblem(req, res) {
        console.log('Get problem request received');
        try {
            const { id } = req.params;

            // Validate ID format
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid problem ID',
                });
            }

            // Find problem by ID
            const problem = await FindSolution.findById(id);
            if (!problem) {
                return res.status(404).json({
                    success: false,
                    error: 'Problem not found',
                });
            }

            // Return success response
            res.json({
                success: true,
                data: problem,
            });
        } catch (error) {
            // Return error response
            res.status(500).json({
                success: false,
                error: 'Server error',
                details: error.message,
            });
        }
    },

    // Retrieve all problems from the database
    // No parameters required
    async getAllProblems(req, res) {
        console.log('Get all problems request received');
        try {
            // Fetch all problems
            const problems = await FindSolution.find();

            // Return success response
            res.json({
                success: true,
                data: problems,
            });
        } catch (error) {
            // Return error response
            res.status(500).json({
                success: false,
                error: 'Server error',
                details: error.message,
            });
        }
    },

    // Update an existing problem by ID
    // Expects 'question' and/or 'answer' in the request body
    async updateProblem(req, res) {
        console.log('Update problem request received');
        try {
            const { id } = req.params;
            const { question, answer } = req.body;

            // Validate ID format
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid problem ID',
                });
            }

            // Validate input fields
            if (!question && !answer) {
                return res.status(400).json({
                    success: false,
                    error: 'At least one field (question or answer) is required',
                });
            }

            // Update problem
            const problem = await FindSolution.findByIdAndUpdate(
                id,
                { question, answer },
                { new: true, runValidators: true }
            );

            if (!problem) {
                return res.status(404).json({
                    success: false,
                    error: 'Problem not found',
                });
            }

            // Return success response
            res.json({
                success: true,
                message: 'Problem updated successfully',
                data: problem,
            });
        } catch (error) {
            // Return error response
            res.status(500).json({
                success: false,
                error: 'Server error',
                details: error.message,
            });
        }
    },

    // Delete a problem by ID
    // Expects 'id' in the URL parameters
    async deleteProblem(req, res) {
        console.log('Delete problem request received');
        try {
            const { id } = req.params;

            // Validate ID format
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid problem ID',
                });
            }

            // Delete problem
            const problem = await FindSolution.findByIdAndDelete(id);
            if (!problem) {
                return res.status(404).json({
                    success: false,
                    error: 'Problem not found',
                });
            }

            // Return success response
            res.json({
                success: true,
                message: 'Problem deleted successfully',
            });
        } catch (error) {
            // Return error response
            res.status(500).json({
                success: false,
                error: 'Server error',
                details: error.message,
            });
        }
    },
};

// Export the controller for use in routes
module.exports = findSolutionController;