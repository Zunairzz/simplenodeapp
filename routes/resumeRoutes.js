const express = require("express");
const router = express.Router();
const {v2: cloudinary} = require('cloudinary');
const {ENDPOINTS} = require('../util/Constants');
const resumeController = require("../controllers/resumeController");

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post(ENDPOINTS.RESUME.ADD, resumeController.createResume);
router.get(ENDPOINTS.RESUME.GET_ALL, resumeController.getAllResumes);
router.get(ENDPOINTS.RESUME.GET_BY_ID, resumeController.getResumeById);
router.put(ENDPOINTS.RESUME.UPDATE, resumeController.updateResumeById);
router.delete(ENDPOINTS.RESUME.DELETE, resumeController.deleteResumeById);
router.delete(ENDPOINTS.RESUME.DELETE_RESOURCES, resumeController.deleteResources)

module.exports = router;

