const express = require("express");
const router = express.Router();

// controller
const {
  register,
  login,
  logout,
  requireLogin
} = require("../controllers/auth.controller.js");

// validators
const {
  validateRegisterDetails,
  validateLoginDetails,
} = require("../validators/auth.validator");

// routes
router.post("/register", validateRegisterDetails, register);
router.post("/login", validateLoginDetails, login);
router.post("/logout", logout);

// login protected route
router.get("/secret", requireLogin, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
