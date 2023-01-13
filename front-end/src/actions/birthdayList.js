import { DEV_BACKEND_URL, URL, ENV } from "../config";
import { capitalize, getDateMonthYearIsBirthday } from "../helpers/utils";

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

export function processDataForSubmission(data) {
  const formData = new FormData();
  const { date, month, year, isBirthday } = getDateMonthYearIsBirthday(
    +data?.date,
    +data?.month,
    +data?.year,
  );

  formData.append("name", capitalize(data.name));
  formData.append("gender", data.gender);
  formData.append("date", date);
  formData.append("month", month);
  formData.append("year", year);
  formData.append("isBirthday", isBirthday);

  if (data.image) formData.append("image", data.image);

  return formData;
}

export function addNewBirthday(formData, token) {
  return fetch(`${API}/birthday/add`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
}

export function editBirthday(formData, id, token) {
  return fetch(`${API}/birthday/edit/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
}

export function deleteBirthday(id, token) {
  return fetch(`${API}/birthday/delete/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
}

export function updateImage(id, formData, token) {
  return fetch(`${API}/birthday/image/update/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
}
