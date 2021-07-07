const {
  isEmpty,
  isValidEmail,
  isPasswordLong,
} = require("../helper/validations");

exports.validateRegisterDetails = (req, res, next) => {
  const { name, email, password } = req.body;
  if (isEmpty(name)) return res.status(422).json({ error: "Name is required" });

  if (!isValidEmail(email))
    return res.status(422).json({ error: "Must be a valid email address" });

  if (!isPasswordLong(password, 6))
    return res
      .status(422)
      .json({ error: "Password must be at least 6 characters long" });

  next();
};

exports.validateLoginDetails = (req, res, next) => {
  const { email, password } = req.body;

  if (!isValidEmail(email))
    return res.status(422).json({ error: "Must be a valid email address" });

  if (!isPasswordLong(password, 6))
    return res
      .status(422)
      .json({ error: "Password must be at least 6 characters long" });

  next();
};
