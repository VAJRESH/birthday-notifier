const mongoose = require("mongoose");

const birthdaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    gender: { type: String, required: true },
    date: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    isBirthday: { type: Boolean, required: true },
    image: { type: String, required: true },
    cloudinary_id: { type: String },
  },
  {
    timestamps: true,
  }
);

const birthdayListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  belongsTo: { type: String, required: true, trim: true, min: 3, index: true },
  birthdays: [{ type: birthdaySchema, default: [] }],
});

const Birthday = mongoose.model("Birthday", birthdaySchema);
const BirthdayList = mongoose.model("Birthdays", birthdayListSchema);

module.exports = {
  Birthday,
  BirthdayList,
};
