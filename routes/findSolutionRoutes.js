const express = require("express");
const router = express.Router();
const findSolutionController = require("../controllers/findSolutionController");
const {ENDPOINTS} = require('../util/Constants');


// Routes
router.post(ENDPOINTS.PROBLEM.ADD, findSolutionController.addProblem);
router.get(ENDPOINTS.PROBLEM.GET, findSolutionController.getProblem);
router.get(ENDPOINTS.PROBLEM.GET_ALL, findSolutionController.getAllProblems);
router.put(ENDPOINTS.PROBLEM.UPDATE, findSolutionController.updateProblem);
router.delete(ENDPOINTS.PROBLEM.DELETE, findSolutionController.deleteProblem);

module.exports = router;