const express = require("express");
const router = express.Router();
const {
    ADD_RESUME_URL,
    GET_RESUME_DATA_URL,
    GET_RESUME_DATA_BY_ID_URL,
    UPDATE_RESUME_DATA_URL,
    DELETE_RESUME_DATA_BY_ID_URL
} = require('../util/Constants');
const resumeController = require("../controllers/resumeController");

router.post(ADD_RESUME_URL, resumeController.createResume);
router.get(GET_RESUME_DATA_URL, resumeController.getAllResumes);
router.get(GET_RESUME_DATA_BY_ID_URL, resumeController.getResumeById);
router.put(UPDATE_RESUME_DATA_URL, resumeController.updateResumeById);
router.delete(DELETE_RESUME_DATA_BY_ID_URL, resumeController.deleteResumeById);

module.exports = router;

