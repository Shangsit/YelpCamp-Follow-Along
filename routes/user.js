const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const userController = require('../controller/user');

router.route('/register')
    .get(userController.renderUserRegisterForm)
    .post(catchAsync(userController.registerUser));


router.route('/login')
    .get(userController.renderUserLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo:true }), userController.loginUser)

router.get('/logout', userController.logoutUser)

module.exports = router;