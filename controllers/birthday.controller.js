const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary");
const { Birthday, BirthdayList } = require("../models/birthday.model");
const { getFormattedDate, isBirthdayToday } = require("../helper/controllers");
const { updateListAndEmailToUsers } = require("../helper/updateListAndNotify");
const XLSX = require("xlsx");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getUserBirthdayList = (req, res) => {
  const name = req.params.user;

  BirthdayList.findOne({ belongsTo: name?.toLowerCase() }).exec((err, list) => {
    if (err) return res.status(400).json({ error: err });

    return res.json(list);
  });
};

// loops through each list and updates isBirthday to true or false
exports.updateList = (req, res) => {
  BirthdayList.find({}).exec((err, list) => {
    if (err) return res.status(400).json({ error: err });
    const userIdAndBirthdays = {};

    list.forEach((object) => {
      object.birthdays.forEach((birthday) => {
        const { date, month, year } = birthday;
        birthday.isBirthday = isBirthdayToday(
          getFormattedDate(date, month, year),
        );

        if (birthday.isBirthday) {
          if (!userIdAndBirthdays[object.userId])
            userIdAndBirthdays[object.userId] = [];
          userIdAndBirthdays[object.userId].push(birthday);
        }
      });
      object.save();
    });

    return res.json(userIdAndBirthdays);
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
        .catch((err) => console.log("Error", err));

      await fs.unlink(req.file.path, (err) => {
        if (err) return console.error(err);
      });

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
      .then((data) => {
        res.json({ message: `${birthdayItem.name}'s birthday updated` });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(`Error: ${err}`);
      });
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
        .catch((err) => console.log("error", err));

      await fs.unlink(req.file.path, (err) => {
        if (err) return console.error(err);
      });

      birthdayItem.image = results.secure_url;
      birthdayItem.cloudinary_id = results.public_id;
    } else {
      birthdayItem.image = "/images/default-avatar.jpg";
      birthdayItem.cloudinary_id = "";
    }

    list
      .save()
      .then(() =>
        res.json({ message: `Image ${updateImage ? "updated" : "removed"}` }),
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
      .then(() => res.json({ message: `${birthday.name}'s Birthday Deleted` }))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
};

exports.checkForBirthdays = (req, res) => {
  updateListAndEmailToUsers()
    .then((msg) => {
      return res.json({ message: msg });
    })
    .catch((err) => res.json({ error: err }));
};

exports.bulkUpload = (req, res) => {
  const userId = req.user._id;

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  BirthdayList.findOne({ userId }).exec(async (err, list) => {
    if (err) return res.status(400).json({ error: err });

    const workbook = XLSX.readFile(req.file.path);
    const sheetNameList = workbook.SheetNames;

    const birthdayArr = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetNameList[0]],
    );

    birthdayArr?.forEach((bd) => {
      const data = {
        name: bd?.Name,
        gender: bd?.Gender?.toLowerCase()?.includes("f") ? "Female" : "Male",
        date: bd?.["Date"],
        month: bd?.Month - 1,
        year: bd?.Year,
        isBirthday: false,
        image: "/images/default-avatar.jpg",
      };
      if (!data?.name) return;

      const newBirthday = new Birthday(data);
      list.birthdays.push(newBirthday);
    });

    await fs.unlink(req.file.path, (err) => {
      if (err) return console.error(err);
    });

    list.save((err, data) => {
      if (err) return res.status(400).json({ error: "Something went wrong" });

      return res.json({ message: `Birthdays added` });
    });
  });
};
