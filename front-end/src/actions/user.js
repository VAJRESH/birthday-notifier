import { DEV_BACKEND_URL, ENV } from "../config";

const API = ENV === "DEVELOPMENT" ? DEV_BACKEND_URL : URL;

export function getUserDetails(name) {
  return fetch(`${API}/user/details/${name}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
}

export function sendEmail(emailData) {
  return fetch(`${API}/user/email`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData)
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
}

