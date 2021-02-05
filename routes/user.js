const express = require('express');
const router = express.Router();
const User = require('../models/user.models');
const bcrypt = require('bcrypt');

require('dotenv').config();

// login
router.get('/login', (req, res) => {
    User.findOne({ email: req.query.email})
    .then(details => {
        if(!(details)){
            res.json("Can't Find");
        }
        res.json(details)
    })
    .catch(err => res.json(err));
})

// register
// router.get('/register', (req, res) => {
//     res.json('registered');
// })

// login
router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user){ 
                return res.json({ message: 'Not Registered!' }); 
            } else{ 
                bcrypt.compare(req.body.password, user.password)
                    .then(isMatch => {
                        if(isMatch){
                            user.isLoggedIn = true;
                            user.save()
                                .then(() => res.json({
                                    message: 'Login Success',
                                    isLoggedIn: true
                                }))
                                .catch(err => res.json({err: err}));
                        } else{
                            res.json({ message: 'Incorrect Password!' }) 
                        }
                    })
                    .catch(err => res.json({err: err}));
            }
        }).catch(err => res.json({err: err}));
})

// register
router.route('/register').post((req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const token  = req.body.token;
    if(token !== process.env.TOKEN){
        return res.json({ message: 'Token is Incorrect. Contact Vajresh!' });
    }
    User.findOne({ email: email }).exec((err, user) => {
        if(err) throw err;
        if(user){
            return res.json({ message: 'Already Registered!' });
        } else {
            const newUser = new User({
                name: name,
                email: email,
                password: password,
                isLoggedIn : true
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(() => {
                            res.json({ message: 'Registered And Logged In Successfully' })
                        })
                        .catch(err => res.json({err: err}));
                    });
                });
            }
        })
})

router.post('/logout', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            console.log(user);
            user.isLoggedIn = false;

            user.save()
            .then(() => res.json({
                isLoggedIn: user.isLoggedIn,
                message: 'Logged Out'
            }))
            .catch(err => res.status(400).json({err: err}));
        }).catch(err => res.status(400).json({err: err}));
})

module.exports = router;