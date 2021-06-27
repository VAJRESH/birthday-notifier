import { DEV_BACKEND_URL, ENV } from "../config";

const API = ENV === "DEVELOPMENT" ? DEV_BACKEND_URL : URL;

export function register(user) {
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
}

export function login(user) {
  return fetch(`${API}/auth/login`, {
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
}

export function isValidName(name) {
  return name.length < 3 ? "Name should be of at least 3 characters." : null;
}

export function isPasswordStrong(password) {
  return password.length < 6
    ? "Password should be of at least 6 characters."
    : null;
}

export function isValidEmail(email) {
  // https://stackoverflow.com/questions/46841752/javascript-regular-expressions-email-address
  // eslint-disable-next-line
  const regex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
  return !regex.test(email) ? "Enter a valid email address." : null;
}

export function setCookies(key, value) {
  document.cookie = `${key}=${value}; path=/; max-age=31536000"`;
}

export function getCookie(key) {
  const cookies = document.cookie;
  const allCookies = cookies
    .split(";")
    .map((items) => items.split("=").map((item) => item.trim()));

  let value;
  allCookies.some((item) => {
    if (item[0] === key.trim()) {
      return (value = item[1]);
    }
    return false;
  });

  return value;
}

export function deleteCookie(key) {
  return (document.cookie = `${key}=; expires=${new Date()}; path=/"`);
}

export function isLoggedIn() {
  const isToken = getCookie("token");
  console.log(isToken);
  return !!isToken;
}

export function logout() {
  deleteCookie("token");
  localStorage.clear();

  return fetch(`${API}/user/logout`, { method: "GET" })
    .then(() => {
      return "Logout Success";
    })
    .catch((err) => {
      console.log(err);
    });
}
