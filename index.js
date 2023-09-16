require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { connectDB } = require('./model/dbConnect');
var bodyParser = require('body-parser')
const app = express();
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
const { User } = require('./model/user');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const { cookieExtractor, sanitizeUser, isAuth } = require('./services/comman');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
connectDB()
app.use(cors({
    exposedHeaders: ['X-Total-Count']
}))
app.use(express.json());
app.use(bodyParser.urlencoded())

// app.use(express.static(path.resolve(__dirname, 'build')));
app.use(cookieParser());


/* passport js */
app.use(
    session({
        secret: "aniket",
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
    })
);


const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

app.use(passport.authenticate('session'));
app.use("/products", isAuth(), require("./router/products"))
app.use("/users", isAuth(), require("./router/user"))
app.use("/auth", require("./router/auth"))
app.use("/brands", isAuth(), require("./router/brands"))
app.use("/categories", isAuth(), require("./router/categories"))
app.use("/cart", isAuth(), require("./router/cart"))
app.use("/orders", isAuth(), require("./router/order"))
app.use("/admin", isAuth(), require("./router/admin"))

// Passport Strategies
passport.use(
    'local',
    new LocalStrategy({ usernameField: 'email' }, async function (
        email,
        password,
        done
    ) {
        // by default passport uses username
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'invalid credentials' }); // for safety
            }
            crypto.pbkdf2(
                password,
                user.salt,
                310000,
                32,
                'sha256',
                async function (err, hashedPassword) {
                    if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                        return done(null, false, { message: 'invalid credentials' });
                    }
                    const token = jwt.sign(
                        sanitizeUser(user),
                        process.env.JWT_SECRET_KEY
                    );
                    done(null, { id: user.id, role: user.role, token }); // this lines sends to serializer
                }
            );
        } catch (err) {
            done(err);
        }
    })
);

passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, sanitizeUser(user)); // this calls serializer
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    })
);
// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, { id: user.id, role: user.role });
    });
});

// this changes session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});




app.listen(8080, () => {
    console.log("server run");
})