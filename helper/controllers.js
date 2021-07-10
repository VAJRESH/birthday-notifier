exports.getFormattedDate = (date, month, year) => {
  if (date.toString().length === 1) date = "0" + date;
  if (month.toString().length === 1) month = "0" + month;
  return [date, month, year];
};

exports.isBirthdayToday = (dateArray) => {
  const [date, month, year] = dateArray;
  const dob = new Date(year, month, date);
  const todayDate = new Date();

  //const birthYear = dob.getFullYear();
  const birthMonth = dob.getMonth();
  const birthDate = dob.getDate();

  //const currentYear = todayDate.getFullYear();
  const currentMonth = todayDate.getMonth();
  const currentDate = todayDate.getDate();

  if (currentMonth === birthMonth && currentDate === birthDate) {
    return true;
  }
  return false;
};
