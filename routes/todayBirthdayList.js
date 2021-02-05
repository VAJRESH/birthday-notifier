const axios = require('axios');
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '..', '.env')});

const host = process.env.HOST;

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
    return yearAge;
}

async function updateList(){
    await axios.get(host+'/days/')
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
                        axios.post(host+'/days/update/isBirthday/'+bd._id, update)
                            .then(res => console.log(res.data))
                            .catch(err => console.log(err));
                    } else {
                        console.log('up 2 date')
                    }
                    
                } else if(bd.isBirthday){
                    let update = {
                        isBirthday: false,
                        age: yearAge
                    }
                    axios.post(host+'/days/update/isBirthday/'+bd._id, update)
                        .then(res => console.log(res.data))
                        .catch(err => console.log(err));
                }
        })
    })
    .then(() => checkAndMail())
    .catch(err => console.log(err));
}

function checkAndMail(){
    axios.get(host+'/days/')
    .then(res => {
            r = res.data;
            const d = new Date();
            r.forEach(e => {
                if(
                    e.year===d.getFullYear() && 
                    parseInt(e.month) === d.getMonth() &&
                    e.date === d.getDate()
                    ){
                        if(e.isBirthday){
                            console.log(e.name)
                            let text = reminderMessage(e);
                            axios.post(host+'/days/mail/', { text: text })
                                .then(res => {
                                    console.log("Email sent");
                                })
                        .catch(err => console.log(err));
                    }
                }
        })
    })
    .catch(err => res.json(err));
}

updateList();

