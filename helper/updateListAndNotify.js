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

function updateListAndEmailToUsers() {
  axios
    .put(`${API}/birthday/list`)
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      for (let userId in data) {
        axios
          .get(`${API}/user/${userId}`)
          .then((res) => {
            console.log(res.data);

            for (let birthdayData of data[userId]) {
              const message = generateMessage(birthdayData);
              const recipient = res.data.email;
              const subject = "Birthday Reminder";
              const emailData = { recipient, subject, message };

              axios
                .post(`${API}/user/email`, emailData)
                .then((emailRes) => {
                  console.log(emailRes.data);
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
}

updateListAndEmailToUsers();
