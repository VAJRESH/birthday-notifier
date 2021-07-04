const User = require("../models/user.model");
const { BirthdayList } = require("../models/birthday.model");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const {
  isEmpty,
  isValidEmail,
  isPasswordLong,
} = require("../helper/validations");

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((findError, user) => {
    if (findError) return res.status(400).json({ error: findError });
    if (user) return res.status(400).json({ error: "Email is taken" });

    const newUser = new User({ name, email, password });
    newUser.save((saveError, user) => {
      if (saveError) return res.status(400).json({ error: saveError });

      const birthdayList = new BirthdayList({
        userId: user._id,
        belongsTo: user.name,
      });
      birthdayList.save((err, data) => {
        if (err) return res.status(400).json({ error: err });

        return res.json({
          message: `New User, ${name} is registered. Please login.`,
        });
      });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((findError, user) => {
    if (findError) return res.status(400).json({ error: findError });
    if (!user)
      return res.status(400).json({ error: `Email is not registered email.` });

    if (!user.isPasswordCorrect(password))
      return res
        .status(400)
        .json({ error: `Email and password does not match!!` });

    // generate token and send it to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { expiresIn: "365d" });

    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  });
};

exports.update = (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user._id;
  let updatedFields = [];

  User.findById(userId).exec((findError, user) => {
    if (findError) return res.status(400).json({ error: findError });
    if (!user)
      return res.status(400).json({ error: `Email is not registered email.` });

    console.log(name, email, password);
    if (name && !isEmpty(name) && name !== user.name) {
      user.name = name;
      updatedFields.push("name");
    }
    if (email && isValidEmail(email) && email !== user.email) {
      user.email = email;
      updatedFields.push("email");
    }

    if (password && isPasswordLong(password, 6)) {
      user.password = password;
      updatedFields.push("password");
    }

    const message = updatedFields.join(" ,");

    if (message.length === 0) {
      return res.json({ message: "No Updates Done" });
    } else {
      user.save((saveError, savedData) => {
        if (saveError) return res.status(400).json({ error: saveError });

        return res.json({
          updatedData: savedData,
          message: message + " updated",
        });
      });
    }
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.user._id;

  User.findByIdAndRemove(userId).exec((findError, user) => {
    if (findError) return res.status(400).json({ error: findError });
    if (!user)
      return res.status(400).json({ error: `Email is not registered email.` });
    BirthdayList.findOneAndDelete({ userId: user._id }).exec((err, doc) => {
      if (err) return res.status(400).json({ error: err });

      res.json("User Account Deleted!!");
    });
  });
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "You are Logged Out!!" });
};

exports.requireLogin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
