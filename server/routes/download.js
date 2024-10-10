const express = require("express");
const router = express.Router();
const { handleFileDownload, getFileUrl } = require("../controllers/download");

router.get("/:id", handleFileDownload);
router.get("/files/:fileName/url", getFileUrl);

module.exports = router;
