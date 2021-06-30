const path = require("path");
const cloudinary = require("cloudinary");
const User = require("../models/user.model");
const { Birthday, BirthdayList } = require("../models/birthday.model");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getUserBirthdayList = (req, res) => {
  const name = req.params.user;

  BirthdayList.findOne({ belongsTo: name }).exec((err, list) => {
    if (err) return res.status(400).json({ error: err });

    return res.json(list);
  });
};

exports.addNewBirthday = (req, res) => {
  const userId = req.user._id;
  const { name, gender, date, month, year, isBirthday } = req.body;
  let image, cloudinary_id;

  BirthdayList.findOne({ userId }).exec(async (err, list) => {
    if (err) return res.status(400).json({ error: err });
    if (!list) return res.status(400).json({ error: "No List Found" });

    if (!req.file) {
      image = "/images/default-avatar.jpg";
      cloudinary_id = "";
    } else {
      const results = await cloudinary.uploader
        .upload(req.file.path)
        .catch((err) => console.log(error, err));

      image = results.secure_url;
      cloudinary_id = results.public_id;
    }

    const newBirthday = new Birthday({
      name,
      gender,
      date,
      month,
      year,
      isBirthday,
      image,
      cloudinary_id,
    });

    list.birthdays.push(newBirthday);

    list.save((err, data) => {
      if (err) return res.status(400).json({ error: err });

      return res.json({ message: `${newBirthday.name} Birthday added` });
    });
  });
};

exports.editBirthday = (req, res) => {
  const userId = req.user._id;
  const { name, gender, date, month, year, isBirthday } = req.body;

  BirthdayList.findOne({ userId }).exec((err, list) => {
    if (err) return res.status(400).json({ error: err });

    const birthdayItem = list.birthdays.id(req.params.id);

    birthdayItem.name = name;
    birthdayItem.gender = gender;
    birthdayItem.date = date;
    birthdayItem.month = month;
    birthdayItem.year = year;
    birthdayItem.isBirthday = isBirthday;

    list
      .save()
      .then(() =>
        res.json({ message: `${birthdayItem.name}'s birthday updated` })
      )
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
};

exports.updateImage = (req, res) => {
  const userId = req.user._id;
  const { updateImage } = req.body;

  BirthdayList.findOne({ userId }).exec(async (err, list) => {
    if (err) return res.status(400).json({ error: err });

    const birthdayItem = list.birthdays.id(req.params.id);

    if (updateImage) {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      
      const results = await cloudinary.uploader
        .upload(req.file.path)
        .catch((err) => console.log(error, err));

      birthdayItem.image = results.secure_url;
      birthdayItem.cloudinary_id = results.public_id;
    } else {
      birthdayItem.image = "/images/default-avatar.jpg";
      birthdayItem.cloudinary_id = "";
    }

    list
      .save()
      .then(() =>
        res.json({ message: `Image ${updateImage ? "updated" : "removed"}` })
      )
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
};

exports.deleteBirthday = (req, res) => {
  const userId = req.user._id;

  BirthdayList.findOne({ userId }).exec(async (err, list) => {
    if (err) return res.status(400).json({ error: err });

    const birthday = list.birthdays.id(req.params.id);
    birthday.remove((removeError, success) => {
      if (removeError) return res.status(400).json({ error: removeError });
    });

    list
      .save()
      .then(() =>
        res.json({ message: `${birthday.name}'s Birthday Deleted` })
      )
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
};
