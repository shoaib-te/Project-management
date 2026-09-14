import express from 'express';
import { updateProfile, getProfile } from '../controllers/Profile.controller.js';
import { authmiddleware } from '../middleware/User.moddleware.js';
const router = express.Router();

/**
 * @route   GET /api/profiles
 * @desc    Get the profile data of the authenticated user
 * @access  Private (Requires authentication token)
 */
router.get('/', authmiddleware, getProfile);

/**
 * @route   PUT /api/profiles
 * @desc    Update the profile details of the authenticated user
 * @access  Private (Requires authentication token)
 */
router.put('/', authmiddleware, updateProfile);

export default router;
