const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const {ENDPOINTS} = require('../util/Constants');

router.post(ENDPOINTS.USER.REGISTER, authController.register);
router.post(ENDPOINTS.USER.LOGIN, authController.login);
router.get(ENDPOINTS.USER.GET_ALL, authController.getProfiles);
router.delete(ENDPOINTS.USER.DELETE, authController.deleteUser);

module.exports = router;
