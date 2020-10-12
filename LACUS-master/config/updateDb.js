const Delivery = require('../models/Delivery');
const validateDate = require('../config/date');

exports.updateDb = function(){
     Delivery.updateMany({$or:[
         {date:validateDate.getToday(),status:'Creata'},
         {date:validateDate.getToday(),status:'Accettata'},
         {date:validateDate.getToday(),status:'Accettata dal corriere'}
        ]},{$set:{status:'Scaduta'}},(err,doc)=>{
            if(err) console.log(err)
        });
}