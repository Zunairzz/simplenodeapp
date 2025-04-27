const express = require("express");
const router = express.Router();
const multer = require('multer');
const {v2: cloudinary} = require('cloudinary');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const {
    ADD_RESUME_URL,
    GET_RESUME_DATA_URL,
    GET_RESUME_DATA_BY_ID_URL,
    UPDATE_RESUME_DATA_URL,
    DELETE_RESUME_DATA_BY_ID_URL
} = require('../util/Constants');
const resumeController = require("../controllers/resumeController");

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'pdfs', // Folder name in Cloudinary
        resource_type: 'raw', // Important! For non-image files like PDF
        format: async (req, file) => 'pdf', // Always save as pdf
        public_id: (req, file) => file.originalname.split('.')[0] // Use original filename without extension
    },
});

// Multer middleware
const upload = multer({storage: storage});


router.post(ADD_RESUME_URL, resumeController.createResume);
router.get(GET_RESUME_DATA_URL, resumeController.getAllResumes);
router.get(GET_RESUME_DATA_BY_ID_URL, resumeController.getResumeById);
router.put(UPDATE_RESUME_DATA_URL, resumeController.updateResumeById);
router.delete(DELETE_RESUME_DATA_BY_ID_URL, resumeController.deleteResumeById);
router.post('/uploads', upload.single('pdf'), resumeController.uploadPdf);
router.put('/update-pdf', upload.single('pdf'), resumeController.updatePdf);

module.exports = router;

