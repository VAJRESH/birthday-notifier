import { DEV_BACKEND_URL, ENV } from "../config";

const API = ENV === "DEVELOPMENT" ? DEV_BACKEND_URL : URL;

export function getListOfUser(user) {
  return fetch(`${API}/birthday/list/${user}`, {
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
