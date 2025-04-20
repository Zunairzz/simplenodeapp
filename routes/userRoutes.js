const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const {REGISTER_URL, LOGIN_URL, GET_ALL_USER_URL, DELETE_USER_URL} = require("../util/Constants");

router.post(REGISTER_URL, authController.register);
router.post(LOGIN_URL, authController.login);
router.get(GET_ALL_USER_URL, authController.getProfiles);
router.delete(DELETE_USER_URL, authController.deleteUser);

module.exports = router;
