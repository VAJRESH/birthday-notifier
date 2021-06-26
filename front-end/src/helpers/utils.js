export function getAgeFromBirthday(date, month, year) {
    const dob = new Date(year, month, date);
    const todayDate = new Date();

    const birthYear = dob.getFullYear();
    const birthMonth = dob.getMonth();
    const birthDate = dob.getDate();
    
    const currentYear = todayDate.getFullYear();
    const currentMonth = todayDate.getMonth();
    const currentDate = todayDate.getDate();

    let yearAge = currentYear-birthYear;
    if(((currentMonth<=birthMonth) && (currentDate<=birthDate))){
        if(currentMonth===birthMonth && currentDate===birthDate){
            ++yearAge;
        }
        --yearAge;
    }
    return yearAge;
}