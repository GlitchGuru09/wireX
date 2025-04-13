const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');
const {pool} = require('../config/postgresql-connection'); 


// Show Register Page
module.exports.getRegisterPage = async function(req, res) {
    res.render("register"); 
};

// Register user
module.exports.registerUser = async function (req, res) {
    try {
        let { name, email, password } = req.body;

        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length > 0) {
            return res.status(401).redirect("/");
        }

        bcrypt.genSalt(10, async function (err, salt) {
            if (err) {
                return res.send(err.message);
            }
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) {
                    return res.send(err.message);
                }
                
                const insertQuery = 'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *';
                const newUser = await pool.query(insertQuery, [name, email, hash]);
                
                let token = generateToken(newUser.rows[0]);
                console.log(token)
                res.cookie("token", token, {
                    httpOnly: true,
                    expires: new Date(Date.now() + 60 * 60 * 1000) // expires in 1 hour
                });                
                return res.redirect("/users/dashboard");
            });
        });
    } catch (err) {
        res.send(err.message);
    }
};


// Show Login Page
module.exports.getLoginPage = async function(req, res) {
    res.render("login"); 
};

// Login user
module.exports.loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;

        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).send("Invalid email or password");
        }

        const user = userResult.rows[0];

        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) {
                return res.send(err.message);
            }
            if (!isMatch) {
                return res.status(401).send("Invalid email or password");
            }

            let token = generateToken(user);
            console.log(token);
            res.cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 60 * 60 * 1000) // expires in 1 hour
            });            
            return res.redirect("/users/dashboard");
        });
    } catch (err) {
        res.send(err.message);
    }
};

module.exports.getDashboard = async function(req, res) {
    res.render("dashboard"); 
};

// //logout
// module.exports.logout = function(req,res){
//     res.cookie("token", "");
//     res.redirect("/");
// }