const express = require("express");
const router = express.Router();
const { handleFileDownload } = require('../controllers/download');

router.get('/:id', handleFileDownload);

module.exports = router;