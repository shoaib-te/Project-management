const express = require('express');
const { authmiddleware, adminmiddleware } = require('../middleware/User.moddleware');
const dashbordcontroller = require('../controllers/dashbord.controller');


const router = express.Router();

router.get('/',authmiddleware,dashbordcontroller)

module.exports = router;
