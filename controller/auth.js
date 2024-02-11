const { User } = require("../model/user");
const crypto = require('crypto')
const { sanitizeUser } = require('../services/comman');
const jwt = require('jsonwebtoken');
const { sendmail } = require("../services/sendMail");
const catchAsyncError = require("../middleware/catchAsynError.js");
const ErrorHandler = require("../utils/ErrorHandler.js.js");
const bcrypt = require('bcrypt');



exports.register = catchAsyncError(async (req, res, next) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;

        if (!email || !password) {

            return next(new ErrorHandler('please enter credentials', 400));
        }

        const user = await User.findOne({ email: email });

        if (user) {
            return next(new ErrorHandler('User all ready exist', 400));
        }

        const newUser = await User.create({ email, password });
        await newUser.save();
        console.log(newUser);
        const token = jwt.sign({ _id: newUser.id }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });
        res.status(200).json({ success: true, user: newUser, token });
    } catch (error) {
        next(error);
    }
});

exports.login = catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // const isMatch = await user.comparePassword(password);
        // const isMatch = await bcrypt.compare(password, usepassword);
        // if (!isMatch) {
        //     return next(new ErrorHandler('Invalid password', 400));
        // }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });
        res.status(200).json({ success: true, user, token: token });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

exports.jwt = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }
        const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });
        res.status(200).json({ success: true, user, token: token });
    } catch (error) {
        next(error);
    }
});




exports.logout = async (req, res) => {
    res.cookie('jwt', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).sendStatus(200)
};


exports.checkUser = async (req, res) => {
    res.status(200).json(req.user)
};

/* reset password */
exports.resetPasswordRequest = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    try {
        // (req, res, next, url)

        if (user) {
            const token = crypto.randomBytes(48).toString('hex');
            user.resetPasswordToken = token;
            await user.save();
            const resetPageLink =
                'http://localhost:3000/reset-password?token=' + token + '&email=' + req.body.email;
            return sendmail(req, res, next, resetPageLink);
        }

    } catch (err) {
        res.status(400).json({ success: false, msg: "user not found" })
    }
};

/* reset password */
exports.resetPassword = async (req, res) => {
    const { email, password, token } = req.body;
    const user = await User.findOne({ email: email, resetPasswordToken: token });
    try {
        if (user) {
            const salt = crypto.randomBytes(16);
            crypto.pbkdf2(
                req.body.password,
                salt,
                310000,
                32,
                'sha256',
                async function (err, hashedPassword) {
                    user.password = hashedPassword;
                    user.salt = salt;
                    await user.save();
                })
        }
        res.status(200).json({ success: true, msg: "password is reset successfully" })

    } catch (err) {
        res.status(400).json({ success: false, msg: "validation err" })
    }
};