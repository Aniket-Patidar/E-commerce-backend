const express = require('express');
const router = express.Router()
const { createUser, loginUser, checkUser, getUserInfo, logout, resetPasswordRequest, resetPassword } = require('../controller/auth');
const passport = require('passport');



router.post('/signup', createUser)
router.get('/logout', logout)
router.post('/login', passport.authenticate('local'), loginUser)
router.get('/check', passport.authenticate('jwt'), checkUser)
router.get('/userInfo', passport.authenticate('jwt'), getUserInfo)
router.post('/reset-password-request', resetPasswordRequest)
router.post('/reset-password', resetPassword)
module.exports = router
