const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');

let Birthday = require('../models/birthday.models');
let router = express.Router();

require('dotenv').config();

// uploads the images to the server folder using above logic
let upload = multer({ 
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './images/');
        },
        filename:(req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname.toLowerCase().split(' ').join('-'));
        }
    }),
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png',]
        if(allowedFileTypes.includes(file.mimetype)){
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});


//** GET REQUESTS
// get all entries
router.route('/').get((req, res) => {
    Birthday.find({}).sort({'name':1})
    .then(birthday => res.json(birthday))
    .catch(err => res.status(400).json('Error: ' + err));
});

// search for a single entry
router.route('/:id').get((req, res) => {
    Birthday.findById(req.params.id)
        .then(birthday => res.json(birthday))
        .catch(err => res.status(400).json(`Error: ${err}`));
});


//** DELETE REQUESTS 
// delete a entry
router.route('/:id').delete((req, res) => {
    Birthday.findByIdAndDelete(req.params.id)
    .then(birthday => {
        const imageName = birthday.image.split('/');
        if(!(imageName[imageName.length-1].includes('default-avatar'))){
            fs.unlinkSync('./images/'+imageName[imageName.length-1]);
        }
        res.json({ message: `${birthday.name} Birthday deleted` })
    })
    .catch(err => res.status(400).json('Error: ' + console.log(err)));
});


//** POST REQUESTS
// add new entry
router.route('/add').post(upload.single('image'), (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const age = req.body.age;
    const gender = req.body.gender;
    const date = req.body.date;
    const month = req.body.month;
    const year = req.body.year;
    const isBirthday = req.body.isBirthday;
    let image;
    if(req.body.image === ''){
        image = 'http://localhost:4000/images/default-avatar.jpg';
    } else {
        image = req.protocol+'://'+req.get('host')+'/images/'+req.file.filename;
    }

    const newBirthday = new Birthday({
        name,
        age,
        gender,
        date,
        month,
        year,
        isBirthday,
        image
    });

    newBirthday.save()
    .then(() => res.json({ message: `${newBirthday.name} Birthday added` }))
    .catch(err => res.status(400).json('Error: ' + console.log(err)));
});

// update a entry
router.route('/update/:id').post(upload.single('image'), (req, res) => {
    console.log(req.body);
    Birthday.findById(req.params.id)
        .then(birthday => {
            birthday.name = req.body.name,
            birthday.age = req.body.age,
            birthday.gender = req.body.gender,
            birthday.date = req.body.date,
            birthday.month = req.body.month,
            birthday.year = req.body.year,
            birthday.isBirthday = req.body.isBirthday
            if(req.file === undefined){
                birthday.image = req.body.imagePath;
            } else {
                birthday.image = req.protocol+'://'+req.get('host')+'/images/'+req.file.filename
            }

            birthday.save()
                .then(() => res.json({message: `${birthday.name}'s Birthday updated` }))
                .catch(err => res.status(400).json(`Error: ${console.log(err)}`));
            }).catch(err => res.status(400).json(`Error: ${err}`));
});


// route for mailing which mails automatically sends a mail from vajresh005@gmail to vajresh5gaming@gmaill.com
router.route('/mail').post((req, res) => {
    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: 'vajresh005@gmail.com',
            pass: process.env.GMAIL_PASSWORD
        }
    });
    let mailOptions = {
        from: 'vajresh005@gmail.com',
        to: 'vajresh5gaming@gmail.com',
        subject: 'Birthday Reminder',
        text: req.body.text
    }
    transport.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
            res.json({"Error: ": err});
        } else{
            console.log("Email Sent.");
            res.json({"Success: ": info.response });
        }
    });
})

module.exports = router;