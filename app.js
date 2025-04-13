const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const { checkConnection, pool } = require("./config/postgresql-connection"); // Import DB check function
require("dotenv").config();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/usersRouter");
const session = require("express-session");
const passport = require("passport");


const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/users", userRouter);


// ✅ Check DB connection before starting the server
checkConnection().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("❌ Server startup failed due to DB connection error:", err.message);
  process.exit(1); // Exit process if DB is not connected
});
