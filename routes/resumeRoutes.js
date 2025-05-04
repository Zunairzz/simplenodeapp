const express = require("express");
const router = express.Router();
const {v2: cloudinary} = require('cloudinary');
const {
    ADD_RESUME_URL,
    GET_RESUME_DATA_URL,
    GET_RESUME_DATA_BY_ID_URL,
    UPDATE_RESUME_DATA_URL,
    DELETE_RESUME_DATA_BY_ID_URL,
    DELETE_RESUME_RESOURCES
} = require('../util/Constants');
const resumeController = require("../controllers/resumeController");

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


router.post(ADD_RESUME_URL, resumeController.createResume);
router.get(GET_RESUME_DATA_URL, resumeController.getAllResumes);
router.get(GET_RESUME_DATA_BY_ID_URL, resumeController.getResumeById);
router.put(UPDATE_RESUME_DATA_URL, resumeController.updateResumeById);
router.delete(DELETE_RESUME_DATA_BY_ID_URL, resumeController.deleteResumeById);
router.post('/uploads', resumeController.uploadPdf);
router.put('/update-pdf', resumeController.updatePdf);
router.delete(DELETE_RESUME_RESOURCES, resumeController.deleteResources)

module.exports = router;

