const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const {
    ADD_PROJECT_URL,
    GET_PROJECTS_URL,
    GET_PROJECT_BY_ID_URL,
    UPDATE_PROJECT_BY_ID_URL,
    DELETE_PROJECT_URL
} = require("../util/Constants");

router.post(ADD_PROJECT_URL, projectController.addProject);
router.get(GET_PROJECTS_URL, projectController.getAllProjects);
router.get(GET_PROJECT_BY_ID_URL, projectController.getProjectById);
router.delete(DELETE_PROJECT_URL, projectController.deleteProject);
router.put(UPDATE_PROJECT_BY_ID_URL, projectController.updateProject);

module.exports = router;