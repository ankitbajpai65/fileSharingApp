const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth')
const handleSendEmail = require('../controllers/email');

router.post('/', verifyToken, handleSendEmail);

module.exports = router;