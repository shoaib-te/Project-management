const express = require('express');
const { authmiddleware } = require('../middleware/User.moddleware');
const { getAllApplications, updateApplicationStatus, createLeaveApplication } = require('../controllers/Leaveapplaction.controller');

const router = express.Router();


router.post('/',authmiddleware,createLeaveApplication)
router.get('/',authmiddleware,getAllApplications)
router.patch('/:id',authmiddleware,updateApplicationStatus)


module.exports = router;
