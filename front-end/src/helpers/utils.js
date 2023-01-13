export function getAgeFromBirthday(date, month, year) {
  if (!+year) return null;

  const dob = new Date(year, month, date);
  const todayDate = new Date();

  const birthYear = dob.getFullYear();
  const birthMonth = dob.getMonth();
  const birthDate = dob.getDate();

  const currentYear = todayDate.getFullYear();
  const currentMonth = todayDate.getMonth();
  const currentDate = todayDate.getDate();

  let yearAge = currentYear - birthYear;
  if (currentMonth <= birthMonth && currentDate <= birthDate) {
    if (currentMonth === birthMonth && currentDate === birthDate) {
      ++yearAge;
    }
    --yearAge;
  }
  return yearAge;
}

export const month = [
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
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function limit() {
  const d = new Date();
  let date = d.getDate();
  let month = d.getMonth() + 1;
  const year = d.getFullYear();
  if (date < 10) {
    date = "0" + date;
  }
  if (month < 10) {
    month = "0" + month;
  }
  return `${year}-${month}-${date}`;
}

export function getFormattedDate(date, month, year) {
  if (date.toString().length === 1) date = "0" + date;
  if (month.toString().length === 1) month = "0" + (month + 1);
  return `${year}-${month}-${date}`;
}

export function getLastNameFromUrl() {
  const url = window.location.pathname.split("/");
  const user = url[url.length - 1];

  return user;
}

export function getDateMonthYearIsBirthday(
  birthDate,
  birthMonth,
  birthYear = null,
) {
  const date = new Date();
  let isBirthday = false;

  const currentMonth = date.getMonth();
  const currentDate = date.getDate();

  if (birthMonth === currentMonth && birthDate === currentDate) {
    isBirthday = true;
  }

  return {
    date: birthDate,
    month: birthMonth,
    year: +birthYear || null,
    isBirthday,
  };
}

export function getDateOptions(selectedMonthInt) {
  let noOfDays = 30;

  if (selectedMonthInt % 2 === 0) noOfDays = 31;
  if (selectedMonthInt === 1) noOfDays = 28;
  if (selectedMonthInt === 1 && selectedMonthInt?.year % 4 === 0) noOfDays = 29;
  if (selectedMonthInt === 7) noOfDays = 31;

  return [...Array(noOfDays)];
}

export function getYearOptions() {
  const years = [];
  const date = new Date();
  const currentYear = date.getFullYear();

  for (let i = 70; i >= 0; --i) {
    years.unshift(currentYear - i);
  }

  years.unshift("--Not Specified--");
  return years;
}
