const express = require('express');
const router = express.Router();
const {getRegisterPage, registerUser, getLoginPage, loginUser, getDashboard, logout} = require('../controllers/authController')
const isloggedin = require('../middlewares/isLoggedIn')
const { isAuthenticated } = require("../middlewares/isAuthenticated");

router.get('/register', getRegisterPage);

router.post('/register', registerUser);

router.get('/login', getLoginPage);

router.post('/login', loginUser);

router.get("/dashboard", getDashboard);

router.get('/logout', logout);


module.exports = router;