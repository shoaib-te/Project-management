const express = require('express');
const router = express.Router();
const { authmiddleware, adminmiddleware } = require('../middleware/User.moddleware'); // Note: check 'moddleware' spelling
const { clockinoutcontroller, getAttendanceByEmployee } = require('../controllers/attendances.controller');

/**
 * @route   POST /api/attendance
 * @desc    Log a new clock-in or clock-out event for the authenticated user
 * @access  Private (Requires authentication token)
 */
router.post('/', authmiddleware, clockinoutcontroller);

/**
 * @route   GET /api/attendance
 * @desc    Retrieve the attendance history of the authenticated user
 * @access  Private (Requires authentication token)
 */
router.get('/', authmiddleware, getAttendanceByEmployee);

module.exports = router;
