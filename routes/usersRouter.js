const express = require('express');
const router = express.Router();
const {getRegisterPage, registerUser, getLoginPage, loginUser, getDashboard, getTransfer, logout} = require('../controllers/authController')
const isloggedin = require('../middlewares/isLoggedIn')
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/register', getRegisterPage);

router.post('/register', registerUser);

router.get('/login', getLoginPage);

router.post('/login', loginUser);

router.get("/dashboard", isloggedin, getDashboard);

router.get("/transfer", isloggedin, getTransfer);

router.get('/logout',isloggedin,  logout);

module.exports = router;