const express = require('express');
const { updateProfile, getProfile } = require('../controllers/Profile.controller');
const { authmiddleware } = require('../middleware/User.moddleware');
const router = express.Router();


router.get('/',authmiddleware,getProfile);  

router.put('/', authmiddleware, updateProfile );



module.exports = router;
