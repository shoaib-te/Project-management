const express = require('express');
const { authmiddleware, adminmiddleware } = require('../middleware/User.moddleware'); // Note: check 'moddleware' spelling
const dashbordcontroller = require('../controllers/dashbord.controller'); // Note: check 'dashbord' spelling

const router = express.Router();

/**
 * @route   GET /api/dashboard
 * @desc    Retrieve aggregated system metrics and stats for the landing dashboard
 * @access  Private (Requires authentication token)
 */
router.get('/', authmiddleware, dashbordcontroller);

module.exports = router;
