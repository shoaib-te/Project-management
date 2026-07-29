const express = require('express');
const router = express.Router();
const authController = require('../controllers/User.controller');
const { authmiddleware } = require('../middleware/User.moddleware'); // Note: check 'moddleware' spelling in path

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return a token / create session
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/session
 * @desc    Validate current user session and return user data
 * @access  Private (Requires authentication middleware)
 */
router.get('/session', authmiddleware, authController.session);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset the authenticated user's password
 * @access  Private (Requires authentication middleware)
 */
router.post('/reset-password', authmiddleware, authController.resetPassword);

module.exports = router;
