import express from 'express';
const router = express.Router();
import { authmiddleware } from '../middleware/User.moddleware.js';
import {
  clockinoutcontroller,
  getAttendanceByEmployee,
} from '../controllers/attendances.controller.js';

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

export default router;
