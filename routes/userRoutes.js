const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const {Constants} = require("../util/Constants");

router.post(Constants.REGISTER_URL, authController.register);
router.post(Constants.LOGIN_URL, authController.login);
router.get(Constants.GET_ALL_USER_URL, authController.getProfiles);
router.delete(Constants.DELETE_USER_URL, authController.deleteUser);

module.exports = router;
