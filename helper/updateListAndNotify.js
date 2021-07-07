const API = "https://birthday-notifier00.herokuapp.com";
const axios = require("axios");

function generateMessage(data) {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `Hope your remember today is ${data.date} ${month[data.month]}, ${
    data.name
  }'s Birthday. Don't forget to wish.`;
}

function isObjectEmpty(obj) {
  if (!obj) return true;

  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

exports.updateListAndEmailToUsers = () => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${API}/birthday/list`)
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        if (isObjectEmpty(data)) return reject("No birthdays today");

        for (let userId in data) {
          axios
            .get(`${API}/user/${userId}`)
            .then((res) => {
              for (let birthdayData of data[userId]) {
                const message = generateMessage(birthdayData);
                const recipient = res.data.email;
                const subject = "Birthday Reminder";
                const emailData = { recipient, subject, message };

                axios
                  .post(`${API}/user/email`, emailData)
                  .then((emailRes) => {
                    resolve("Email send to the users");
                    console.log(emailRes.data);
                  })
                  .catch((emailErr) => reject(`Email Error: ${emailErr}`));
              }
            })
            .catch((userErr) => reject(`User List Error: ${userErr}`));
        }
      })
      .catch((birthdayErr) => reject(`Birthday List Error: ${birthdayErr}`));
  });
};
