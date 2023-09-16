const passport = require("passport");

exports.isAuth = (req, res, done) => {
    return passport.authenticate('jwt');
};

exports.sanitizeUser = (user) => {
    return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZmRiMTNlNTk5M2Q3MGM0NDg5NDQ2MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NDQzODU2OH0.BqUyBiEz4Kt3-wK2IPGfZDXO_OZlTPwnITt2QE7lh6E"
    return token;
};
