const jwt = require('jsonwebtoken');
const { User } = require('../model/user');

async function AdminAuthenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader;
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, tokenData) => {
        if (err) return res.sendStatus(403);

        try {
            // Fetch user details from the database based on _id from the token
            const user = await User.findById(tokenData._id);

            if (!user) {
                return res.status(404).json({ success: false, msg: "User not found" });
            }

            // Check if the user has admin role
            if (user.role !== 'admin') {
                return res.status(403).json({ success: false, msg: "Unauthorized: Only admin users allowed" });
            }

            // Attach user details to the request object
            req.user = user;
            next();
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ success: false, msg: "Internal server error" });
        }
    });
}

module.exports = AdminAuthenticateToken;
