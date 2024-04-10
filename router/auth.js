const express = require('express');
const router = express.Router()
const { checkUser, getUserInfo, logout, resetPasswordRequest, resetPassword, register, login, jwt } = require('../controller/auth');
const passport = require('passport');
const authenticateToken = require('../middleware/jwt');



router.post('/signup', register)
router.post('/login', login)
router.get('/userInfo', authenticateToken, jwt)
router.get('/logout', authenticateToken, logout)
router.post('/reset-password-request', resetPasswordRequest)
router.post('/reset-password', resetPassword)


// router.get('/check', authenticateToken, jwt)
module.exports = router
