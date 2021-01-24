const express = require('express');
let router = express.Router();
const axios = require('axios');
// const path = require('path');

function reminderMessage(data){
    const textArray = [`Hope your remember today is ${data.date} ${data.month}, ${data.name}'s Birthday. Don't forget to wish.`]
    return textArray[0];
}
function checkAndMail(){
    axios.get('http://localhost:4000/days/')
    .then(res => {
            let i=1;
            r = res.data;
            r.forEach(e => {
                const d = new Date();
                if(
                    e.year===d.getFullYear() && 
                    parseInt(e.month) === d.getMonth() &&
                    e.date === d.getDate()
                ){
                    let text = reminderMessage(e); 
                    console.log(e.name);
                    axios.post('http://localhost:4000/days/mail/', { text: text })
                        .then(res => {
                            console.log("Email sent"+i);
                            i++;
                        })
                        .catch(err => console.log(err));
                } 
            });
        })
        .catch(err => console.log(err));

}


// router.route('/mail').post((req, res) => {
    
// });
// checkAndMail();

// module.exports = router;

