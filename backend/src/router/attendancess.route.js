const express = require('express');
const router = express.Router();
const { authmiddleware, adminmiddleware } = require('../middleware/User.moddleware');
const { clockinoutcontroller, getAttendanceByEmployee } = require('../controllers/attendances.controller');


    
router.post('/', authmiddleware, clockinoutcontroller);
router.get('/', authmiddleware, getAttendanceByEmployee);

module.exports = router;
