const {
  isEmpty,
  isValidEmail,
  isPasswordLong,
} = require("../helper/validations");

exports.validateDetails = (req, res, next) => {
  const { name, gender, date, month, year, isBirthday } = req.body;
  if (
    isEmpty(name) ||
    isEmpty(gender) ||
    isEmpty(date) ||
    isEmpty(month) ||
    isEmpty(year) ||
    isEmpty(isBirthday)
  ) {
    return res.status(422).json({ errors: "Name is required" });
  }

  next();
};
