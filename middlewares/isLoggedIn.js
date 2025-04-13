const jwt = require("jsonwebtoken");
const {pool} = require("../config/postgresql-connection");

module.exports = async function (req, res, next) {
    const token = req.cookies.token;
    console.log(token)

    if (!token) {
        return res.status(401).json({ message: "You need to login." });
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log(decoded)

        const userQuery = 'SELECT id, name, email FROM users WHERE email = $1';
        const userResult = await pool.query(userQuery, [decoded.email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Invalid token. User not found." });
        }

        req.user = userResult.rows[0]; // attach user data to the request object
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token. Please login again." });
    }
};
