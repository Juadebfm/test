const express = require("express");
const {
  register,
  logIn,
  getProfile,
} = require("../controllers/authController");
const auth = require("../middleware/Auth");
const router = express.Router();

// public
router.post("/register", register);
router.post("/login", logIn);

// protected route
router.get("/profile", auth, getProfile);
module.exports = router;
