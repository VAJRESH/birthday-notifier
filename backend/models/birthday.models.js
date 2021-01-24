const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let Birthday = new Schema({
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    date: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    isBirthday: { type: Boolean, required: true },
    image: { type: String, required: true }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Birthday', Birthday);