
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String,required: true},
    surname: {type: String,required: true},
    email: {type: String,required: true},
    password: {type: String,required: true},
    shipmentsSend:{type: Number,default:0},
    shipmentsReceived:{type: Number,default:0},
    shipmentsMade:{type: Number, default:0},
    profit: {type: Number,default:0},
    date: {type: Date,default: Date.now}
});

const User = mongoose.model('User',UserSchema);
module.exports = User;

