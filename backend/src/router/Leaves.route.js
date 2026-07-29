const express = require('express');
const { authmiddleware, adminmiddleware } = require('../middleware/User.moddleware'); // Note: check 'moddleware' spelling
const { getAllApplications, updateApplicationStatus, createLeaveApplication } = require('../controllers/Leaveapplaction.controller'); // Note: check 'Leaveapplaction' spelling

const router = express.Router();

/**
 * @route   POST /api/leave
 * @desc    Submit a new leave application
 * @access  Private (Requires authentication token)
 */
router.post('/', authmiddleware, createLeaveApplication);

/**
 * @route   GET /api/leave
 * @desc    Retrieve all leave applications
 * @access  Private (Requires authentication token)
 */
router.get('/', authmiddleware, getAllApplications);

/**
 * @route   PATCH /api/leave/:id
 * @desc    Update the status (Approve/Reject) of a specific leave application
 * @access  Private (Requires Admin permissions)
 */
router.patch('/:id', authmiddleware, adminmiddleware, updateApplicationStatus);

module.exports = router;
