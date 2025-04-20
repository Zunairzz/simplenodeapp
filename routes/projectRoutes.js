const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const {Constants} = require("../util/Constants");

router.post(Constants.ADD_PROJECT_URL, projectController.addProject);
router.get(Constants.GET_PROJECTS_URL, projectController.getAllProjects);
router.get(Constants.GET_PROJECT_BY_ID_URL, projectController.getProjectById);
router.delete(Constants.DELETE_PROJECT_URL, projectController.deleteProject);
router.put(Constants.UPDATE_PROJECT_BY_ID_URL, projectController.updateProject);

module.exports = router;