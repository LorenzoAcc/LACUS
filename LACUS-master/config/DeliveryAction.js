const Delivery = require('../models/Delivery');
const User = require('../models/Users');

module.exports = {
    //Update sender profile
    updateSender : function(userId){        
        User.findOneAndUpdate({
            _id: userId
        },{$inc:{shipmentsSend:1}
            },
            (err,doc)=>{
                if(err)console.log(err)
            }
        )
    },
    //Update recipient profile
    updateRecipient : function(userId){
        User.findOneAndUpdate({
            _id: userId
        },{$inc:{shipmentsReceived:1}
            },
            (err,doc)=>{
                if(err)console.log(err)
            }
        )
    },
    //Update carrier profile
    updateCarrier : function(userId,profit){
        console.log(profit)
        var userProfit = 0;
        User.findOne({
            _id:userId
        },(err,doc)=>{
            if(err) console.log(err)
        }).then(user=>{
            userProfit = user.profit;
            userProfit = userProfit+profit;
            console.log("Il profitto aggiornato è:"+userProfit)
            User.findOneAndUpdate({
                _id:userId
            },{
                $set:{profit:userProfit}
            },(err,doc)=>{
                if(err) console.log(err)
                else console.log(doc)
            })
        })
    },
    confirmArrival : function(idDelivery){
       Delivery.findOneAndUpdate({
           _id: idDelivery
       },{$set:{status:"Consegnata"}},(err,delivery)=>{
           if(err) console.log(err)
           else{
               console.log(delivery.price)
            this.updateSender(delivery.idSender)
            this.updateRecipient(delivery.idRecipient)
            this.updateCarrier(delivery.idCarrier,delivery.price)

           } 
       })
    }
}

