const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Mongodb connection successful');
});

const addBirthdays = require('./routes/add_birthdays');
app.use('/days', addBirthdays);

// const sendMail = require('./routes/todayBirthdayList');
// app.use('/today', sendMail);
app.use('/images', express.static('./images'));
app.listen(port, function() {
    console.log(`Server up and running on port ${port}`);
});