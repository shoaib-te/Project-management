import express from 'express';
import { authmiddleware, adminmiddleware } from '../middleware/User.moddleware.js';
import {
  getAllApplications,
  updateApplicationStatus,
  createLeaveApplication,
} from '../controllers/Leaveapplaction.controller.js';

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

export default router;
