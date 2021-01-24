const express = require('express');
let router = express.Router();
let Birthday = require('../models/birthday.models');
const nodemailer = require('nodemailer');
const multer = require('multer');
// const fs = require('fs');
// let path = require('path');
// let Avatar = require('../models/avatar.models');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/');
    },
    filename:(req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.toLowerCase().split(' ').join('-'));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png',]
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ 
    storage: storage,
    // limits: {
    //     fileSize: 1024*1024*5
    // },
    fileFilter: fileFilter
});

// router.route('/uploadmulter').post((req, res, next) => {
//     console.log(req.body);
//     let uploadFile = req.files.uploadFile;
//     console.log(uploadFile);
//     const imageUrl = `/uploads/${uploadFile.name}`;
//     const loc = path.join(__dirname,'uploads','images',uploadFile.name);
//     // uploadFile.mv(path.join(__dirname,'uploads','images',uploadFile.name))
//     // .then(() => { res.json({message: 'file uploaded', imageUrl: imageUrl})})
//     // .catch(err => console.log(err));
//     const newImage = new Avatar({
//         imageName: req.body.imageName,
//         imageData: imageUrl
//     });

//     newImage.save()
//         .then(result => {
//             console.log(result);
//             res.status(200).json({ success: true, document: result });
//         }).catch(err => next(err));
// })

router.route('/mail').post((req, res) => {
    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: 'vajresh005@gmail.com',
            pass: 'pywxlznnakvaykyb'
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

// get all entries
router.route('/').get((req, res) => {
    Birthday.find({}).sort({'name':1})
    .then(birthday => res.json(birthday))
    .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/avatar').get((req, res) => {
//     Avatar.find()
//     .then(birthday => res.json(birthday))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

// search for a single entry
router.route('/:id').get((req, res) => {
    Birthday.findById(req.params.id)
        .then(birthday => res.json(birthday))
        .catch(err => res.status(400).json(`Error: ${err}`));
});
// req.protocol+'://'+req.get('host')+'/images'+req.file.filename
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
    // const image = 'http://localhost:4000/images/default-avatar.jpg';
    const image = req.protocol+'://'+req.get('host')+'/images/'+req.file.filename;

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
    .then(() => res.json('Birthday added'))
    .catch(err => res.status(400).json('Error: ' + console.log(err)));
});

// delete a entry
router.route('/:id').delete((req, res) => {
    Birthday.findByIdAndDelete(req.params.id)
    .then(birthday => res.json(`${birthday.name} deleted`))
    .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/image/:id').post((res, req) => {
//     Birthday.findById(req.params.id)
//     .then(birthday => {
//         birthday.image = 'http://localhost:4000/images/default-avatar.jpg'
        
//         birthday.save()
//             .then(() => res.json('Birthday updated'))
//             .catch(err => res.status(400).json(`Error: ${err}`));
//         }).catch(err => res.status(400).json(`Error: ${err}`));
// });

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
                .then(() => res.json('Birthday updated'))
                .catch(err => res.status(400).json(`Error: ${console.log(err)}`));
            }).catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;