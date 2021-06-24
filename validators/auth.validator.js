exports.validateRegisterDetails = (req, res, next) => {
  const { name, email, password } = req.body;
  if (isEmpty(name))
    return res.status(422).json({ errors: "Name is required" });

  if (!isValidEmail(email))
    return res.status(422).json({ errors: "Must be a valid email address" });

  if (!isPasswordLong(password, 6))
    return res
      .status(422)
      .json({ errors: "Password must be at least 6 characters long" });
 
  next();
};

exports.validateLoginDetails = (req, res, next) => {
  const { email, password } = req.body;

  if (!isValidEmail(email))
    return res.status(422).json({ errors: "Must be a valid email address" });

  if (!isPasswordLong(password, 6))
    return res
      .status(422)
      .json({ errors: "Password must be at least 6 characters long" });

  next();
};


const isPasswordLong = (password, length) => {
  return (password.length >= length);
}

const isValidEmail = (email) => {
  // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  const regex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

const isEmpty = (value) => {
  return (!value.trim());
}