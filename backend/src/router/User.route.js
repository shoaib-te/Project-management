const express = require('express');
const router = express.Router();
const authController = require('../controllers/User.controller');
const { authmiddleware } = require('../middleware/User.moddleware');



router.post('/login', authController.login);

router.get('/session' , authmiddleware,authController.session);
router.post('/reset-password',authmiddleware, authController.resetPassword);

module.exports = router;
