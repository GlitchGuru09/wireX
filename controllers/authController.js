const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
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

// show dashboard
module.exports.getDashboard = async function(req, res) {
    res.render("dashboard"); 
};


// Redirects the user to Google's OAuth 2.0 server for authentication
module.exports.getGoogleAuth = (req, res, next) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next); 
  };

//Google OAuth callback
module.exports.handleGoogleCallback = (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    if (err || !user) {
      return res.redirect("/users/login");
    }

    try {
      let token = generateToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      res.redirect("/users/dashboard");
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

//Passport Google Strategy
module.exports.configureGoogleStrategy = async function (req, res) {
    passport.use("google", new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      userProfileURL: process.env.GOOGLE_USER_PROFILE_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const userResult = await pool.query(userQuery, [profile.email]);
  
        if (userResult.rows.length === 0) {
          const newUser = await pool.query(
            "INSERT INTO users (name, email, oauth_provider, oauth_id) VALUES ($1, $2, $3, $4)",
            [profile.name, profile.email, "google", profile.id]
          );
          cb(null, newUser.rows[0]);
        } else {
          cb(null, userResult.rows[0]);
        }
      } catch (err) {
        cb(err);
      }
    }));
  };
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  

  module.exports.logout = function (req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
  
      req.session.destroy(() => {
        res.clearCookie("connect.sid"); // clears the session cookie
        res.clearCookie("token");       // clears the JWT token cookie
        res.redirect("/");
      });
    });
  };
  
  