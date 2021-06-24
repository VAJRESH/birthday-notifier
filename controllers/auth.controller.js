const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((findError, user) => {
    if (findError) return res.status(400).json({ error: findError });
    if (user) return res.status(400).json({ error: "Email is taken" });

    const newUser = new User({ name, email, password });
    newUser.save((saveError, success) => {
      if (saveError) return res.status(400).json({ error: saveError });

      res.json({ message: `New User, ${name} is registered. Please login.` });
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
    res.cookie("token", token, { expiresIn: "1d" });

    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
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

exports.isLoggedIn = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId).exec((findError, user) => {
    if (findError) return res.status(400).json({ error: findError });
    if (!user) return res.status(400).json({ error: `User not found. Please Login!` });

    req.user = user;
    next();
  });
};
