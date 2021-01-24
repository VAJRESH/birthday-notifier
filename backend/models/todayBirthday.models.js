const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TodayBirthday = new Schema({
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    date: { type: Number, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    isMailDone: { type: Boolean, required: true },
    scheduleCount: { type: Number, required:true }
}, {
    timestamps: true,
    collection: todayBirthday
})

module.exports = mongoose.model('TodayBirthday', TodayBirthday);