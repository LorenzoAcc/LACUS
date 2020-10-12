
const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
    idSender:{type: String,required: true},
    nameSender:{type:String,required:true},
    surnameSender:{type:String,required:true},
    idRecipient:{type: String,required: true},
    nameRecipient:{type:String,required:true},
    surnameRecipient:{type:String,required:true},
    idCarrier:{type: String,required: false},
    startPlace:{type: String,required: true},
    endPlace:{type: String,required: true},
    status:{type: String,default: "Creata"},
    price:{type: Number ,required: true},
    distance:{type: Number,required:true},
    height:{type:Number,required:true},
    width:{type:Number,required:true},
    depth:{type:Number,required:true},
    type:{type: String,required: true},
    date: {type: String,required: true},
    arrivoPrevisto:{type:String}
});

const Delivery = mongoose.model('Delivery',DeliverySchema);
module.exports = Delivery;