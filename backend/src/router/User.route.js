const express = require('express');
const router = express.Router();
const authController = require('../controllers/User.controller');
const { authmiddleware } = require('../middleware/User.moddleware');



router.post('/login',authmiddleware, authController.login);

router.post('/logout', authController.logout);

router.get('/session' , authmiddleware,authController.session);
router.post('/reset-password',authmiddleware, authController.resetPassword);

module.exports = router;
