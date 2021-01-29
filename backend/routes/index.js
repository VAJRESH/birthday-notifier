const express = require('express');
const router = express.Router();

// login
router.get('/login', (req, res) => {
    res.render('welcome');
})

// register
router.get('/register', (req, res) => {
    res.render('login');
})

module.exports = router;