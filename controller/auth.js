const { User } = require("../model/user");
const crypto = require('crypto')
const { sanitizeUser } = require('../services/comman');
const jwt = require('jsonwebtoken');
const { sendmail } = require("../services/sendMail");

exports.createUser = async (req, res) => {
    try {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(
            req.body.password,
            salt,
            310000,
            32,
            'sha256',
            async function (err, hashedPassword) {
                const user = new User({ ...req.body, password: hashedPassword, salt });
                const doc = await user.save();

                req.login(sanitizeUser(doc), (err) => {
                    // this also calls serializer and adds to session
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        const token = jwt.sign(
                            sanitizeUser(doc),
                            process.env.JWT_SECRET_KEY
                        );
                        res
                            .cookie('jwt', token, {
                                expires: new Date(Date.now() + 3600000),
                                httpOnly: true,
                            })
                            .status(201)
                            .json({ success: true, user: doc });
                    }
                });
            }
        );
    } catch (err) {
        res.status(400).json({ success: false, msg: "please enter vaild data" });
    }
};

exports.getUserInfo = async (req, res) => {
    const user = await User.findById(req.user.id);
    try {
        res.status(201).json({ success: true, user: user })
    } catch (err) {
        res.status(400).json({ success: false, msg: "user not found" })
    }
};

exports.loginUser = async (req, res) => {
    const user = req.user;
    res
        .cookie('jwt', user.token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
        })
        .status(201)
        .json({ user: user });
};

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