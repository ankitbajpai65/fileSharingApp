const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
  handleUserSignup,
  handleUserLogin,
  handleUserDetails,
  handleUserLogout,
} = require("../controllers/user");

router.post("/register", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/userData", verifyToken, handleUserDetails);
router.post("/logout", handleUserLogout);

module.exports = router;
