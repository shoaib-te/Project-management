const express = require('express');
const { updateProfile, getProfile } = require('../controllers/Profile.controller');
const { authmiddleware } = require('../middleware/User.moddleware'); // Note: check 'moddleware' spelling in path
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

module.exports = router;
