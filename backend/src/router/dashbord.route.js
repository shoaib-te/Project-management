import express from 'express';
import { authmiddleware } from '../middleware/User.moddleware.js';
import dashbordcontroller from '../controllers/dashbord.controller.js';

const router = express.Router();

/**
 * @route   GET /api/dashboard
 * @desc    Retrieve aggregated system metrics and stats for the landing dashboard
 * @access  Private (Requires authentication token)
 */
router.get('/', authmiddleware, dashbordcontroller);

export default router;
