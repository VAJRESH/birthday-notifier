const express = require("express");
const router = express.Router();

// controller
const {
  getDetails,
  getDetailsByUserName,
  sendMails,
} = require("../controllers/user.controller");

// routes
router.get("/:id", getDetails);
router.get("/details/:name", getDetailsByUserName);
// route which automatically sends a mail from vajresh005@gmail to recipient email
router.post("/email", sendMails);

module.exports = router;
