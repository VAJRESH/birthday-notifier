const express = require("express");
const router = express.Router();
const multer = require("multer");

// controller
const {
  register,
  login,
  logout,
  update,
  deleteUser,
  isNameTaken,
  requireLogin
} = require("../controllers/auth.controller.js");

// validators
const {
  validateRegisterDetails,
  validateLoginDetails,
} = require("../validators/auth.validator");

// routes
router.get("/:name", isNameTaken);
router.post("/register", validateRegisterDetails, register);
router.post("/login", validateLoginDetails, login);
router.put("/update", multer().none(), requireLogin, update);
router.post("/logout", logout);
router.delete("/delete", requireLogin, deleteUser);

module.exports = router;
