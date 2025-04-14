const express = require('express');
const router = express.Router();
const {handleGoogleCallback, getGoogleAuth} = require('../controllers/authController')

router.get("/google", getGoogleAuth);

router.get("/google/wirex", handleGoogleCallback);

module.exports = router;



