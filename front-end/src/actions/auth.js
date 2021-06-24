import axios from "axios";

const API = "http://localhost:4000";

export const register = (user) => {
  return fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

// export const signin = (user) => {
//     return fetch(`${API}/user/signin`, {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(user)
//     })
//         .then((res) => {
//             return res.json();
//         })
//         .catch((err) => console.log(err));
// }
