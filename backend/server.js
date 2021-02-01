const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// environment variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// database connection
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

// login system
const user = require('./routes/user');
app.use('/user', user);

// routes for crud actions
const addBirthdays = require('./routes/crud_actions');
app.use('/days', addBirthdays);

// images folder for saving uploaded avatar
app.use('/images', express.static('./images'));

app.listen(port, function() {
    console.log(`Server up and running on port ${port}`);
});