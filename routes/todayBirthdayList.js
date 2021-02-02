const express = require('express');
const axios = require('axios');

//TODO cron job, reminder message
function reminderMessage(data){
    const textArray = [`Hope your remember today is ${data.date} ${data.month}, ${data.name}'s Birthday. Don't forget to wish.`]
    return textArray[0];
}
function getAge(data){
    currentYear = new Date().getFullYear()
    currentMonth = new Date().getMonth()
    currentDate = new Date().getDate()
    let yearAge = currentYear - data.year;
    if(currentMonth<=data.month && currentDate<=data.date){
        if(currentMonth===data.month && currentDate===data.date){
            ++yearAge;
        }
        --yearAge;
    }
    // console.log(yearAge);
    return yearAge;
}

async function updateList(){
    await axios.get('http://localhost:4000/days/')
    .then(res => {
        const list = res.data;
        const d = new Date();
        list.forEach(bd => { 
            let yearAge = getAge(bd)
            if(
                bd.year===d.getFullYear() && 
                parseInt(bd.month) === d.getMonth() &&
                bd.date === d.getDate()
                ){
                    if(!bd.isBirthday){
                        let update = {
                            isBirthday: true,
                            age: yearAge
                        }
                        axios.post('http://localhost:4000/days/update/isBirthday/'+bd._id, update)
                            .then(res => console.log(res.data))
                            .catch(err => console.log(err));
                    } else {
                        console.log('up 2 date')
                    }
                    
                } else if(bd.isBirthday){
                    console.log('up ')
                    let update = {
                        isBirthday: false,
                        age: yearAge
                    }
                    axios.post('http://localhost:4000/days/update/isBirthday/'+bd._id, update)
                        .then(res => console.log(res.data))
                        .catch(err => console.log(err));
                }
        })
    })
    .then(() => checkAndMail())
    .catch(err => console.log(err));
}

function checkAndMail(){
    axios.get('http://localhost:4000/days/')
    .then(res => {
            r = res.data;
            r.forEach(e => {
                console.log(e.name, e.age);
                if(e.isBirthday){
                    let text = reminderMessage(e); 
                //     axios.post('http://localhost:4000/days/mail/', { text: text })
                //         .then(res => {
                //             console.log("Email sent");
                //         })
                // .catch(err => console.log(err));
                }
        })
    })
    .catch(err => res.json(err));
}

updateList();
// checkAndMail();


