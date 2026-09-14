import express from 'express';
const router = express.Router();
import { login, session, resetPassword } from '../controllers/User.controller.js';
import { authmiddleware } from '../middleware/User.moddleware.js';

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return a token / create session
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/session
 * @desc    Validate current user session and return user data
 * @access  Private (Requires authentication middleware)
 */
router.get('/session', authmiddleware, session);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset the authenticated user's password
 * @access  Private (Requires authentication middleware)
 */
router.post('/reset-password', authmiddleware, resetPassword);

export default router;
