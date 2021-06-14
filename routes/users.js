const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport');
const review = require('../models/review');
const users = require('../controllers/users')


router.get('/register',users.userRenderRegister)

router.post('/register',users.userRegisterForm)

router.get('/login' ,users.getLogin)

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), users.renderLogin)

router.get('/logout',users.logout)

module.exports = router;