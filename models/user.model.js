const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, min: 3, index: true },
    email: { type: String, required: true, unique: true },
    emailList: [{ type: String, trim: true, default: [] }],
    salt: String,
    hashed_password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

// plain password String is salted and saved in hashed_password in db
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;

    // save salt and password in db
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  isPasswordCorrect: function (password) {
    return this.encryptPassword(password) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";

    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = mongoose.model("User", userSchema);
