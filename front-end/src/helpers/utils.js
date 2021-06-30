export function getAgeFromBirthday(date, month, year) {
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
