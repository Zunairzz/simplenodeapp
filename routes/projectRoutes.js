const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const {ENDPOINTS} = require("../util/Constants");

router.post(ENDPOINTS.PROJECT.ADD, projectController.addProject);
router.get(ENDPOINTS.PROJECT.GET_ALL, projectController.getAllProjects);
router.get(ENDPOINTS.PROJECT.GET_BY_ID, projectController.getProjectById);
router.delete(ENDPOINTS.PROJECT.DELETE, projectController.deleteProject);
router.put(ENDPOINTS.PROJECT.UPDATE, projectController.updateProject);

module.exports = router;