const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const { checkConnection, pool } = require("./config/postgresql-connection"); // Import DB check function
require("dotenv").config();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/usersRouter");
const authRouter = require("./routes/authRouter");
const session = require("express-session");
const passport = require("passport");
const { configureGoogleStrategy } = require("./controllers/authController");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // maxAge: 24 * 60 * 60 * 1000, // 1 day
  }
}));

configureGoogleStrategy()

// This tells Passport to **use session data** to store the authenticated user.
//  Without this, users would have to log in every time they refresh the page.
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/auth",authRouter)


// app.get("/auth/google", passport.authenticate("google", {
//   scope: ["profile", "email"]
// }))

// app.get("/auth/google/wirex", passport.authenticate("google", {
//   successRedirect: "/users/dashboard",
//   failureRedirect: "/users/login"
// }));

// passport.use("google", new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/wirex",
//     userProfileURL: "http://www.googleapis.com/oauth2/v3/userinfo",
// }, async (accessToken, refreshToken, profile, cb) => {
//     console.log(profile);
//     try {
//       const userQuery = 'SELECT * FROM users WHERE email = $1';
//       const userResult = await pool.query(userQuery, [profile.email])

//       if(userResult.rows.length === 0){
//         const newUser = await pool.query(
//           "INSERT INTO users (name,email,oauth_provider,oauth_id) VALUES ($1, $2, $3, $4)",
//           [profile.name, profile.email, "google", profile.id]
//         );
//         cb(null, newUser.rows[0]);
//       }
//       else{
//         //already existing user
//         cb(null, userResult.rows[0]);
//       }
//     } catch(err){
//       cb(err);
//     }
// }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// ✅ Check DB connection before starting the server
checkConnection().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("❌ Server startup failed due to DB connection error:", err.message);
  process.exit(1); // Exit process if DB is not connected
});
