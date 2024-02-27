const express = require("express");
const router = express.Router();
const {
    handleUserSignup,
    handleUserLogin,
    handleUserDetails,
    handleUserLogout
} = require('../controllers/user');

router.post('/register', handleUserSignup);
router.post('/login', handleUserLogin);
router.post('/userData', handleUserDetails);
router.post('/logout', handleUserLogout);

module.exports = router;