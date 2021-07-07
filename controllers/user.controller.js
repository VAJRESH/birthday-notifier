const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

exports.getDetails = (req, res) => {
  const userId = req.params.id;

  User.findById(userId).exec((findError, user) => {
    if (findError) return res.status(400).json({ error: findError });

    user.salt = undefined;
    user.hashed_password = undefined;

    res.json(user);
  });
};

exports.getDetailsByUserName = (req, res) => {
  const name = req.params.name;

  User.findOne({ name }).exec((findError, user) => {
    if (findError) return res.status(400).json({ error: findError });
    if (!user) return res.status(400).json({ error: "User not found!!" });

    user.salt = undefined;
    user.hashed_password = undefined;

    res.json(user);
  });
};

exports.sendMails = (req, res) => {
  const { recipient, subject, message } = req.body;
  let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "vajresh005@gmail.com",
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  let mailOptions = {
    from: "vajresh005@gmail.com",
    to: recipient,
    subject: subject,
    text: message,
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      res.json({ "Error: ": err });
    } else {
      res.json({ "Success: ": info.response });
    }
  });
};
