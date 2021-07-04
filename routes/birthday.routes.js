const express = require("express");
const multer = require("multer");

// parse form data and attach to req.body and req.file
let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./images/");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        Date.now() + "-" + file.originalname.toLowerCase().split(" ").join("-")
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

let router = express.Router();

// controller
const {
  getUserBirthdayList,
  updateList,
  addNewBirthday,
  editBirthday,
  updateImage,
  deleteBirthday,
} = require("../controllers/birthday.controller");
const { requireLogin } = require("../controllers/auth.controller.js");

// validators
const { validateDetails } = require("../validators/birthday.validator");

// routes
router.get("/list/:user", getUserBirthdayList);
router.put("/list", updateList);
router.delete("/delete/:id", requireLogin, deleteBirthday);
router.put("/edit/:id", upload.single("image"), requireLogin, editBirthday);
router.post(
  "/add",
  upload.single("image"),
  validateDetails,
  requireLogin,
  addNewBirthday
);
router.put(
  "/image/update/:id",
  upload.single("image"),
  requireLogin,
  updateImage
);


module.exports = router;
