const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated , forwardAuthenticated  } = require('../config/off')
//User model
const User = require('../models/Users');
//Delivery model
const Delivery = require('../models/Delivery');
const validateDate = require('../config/date');
const Price = require('../config/price');
const DeliveryAction = require('../config/DeliveryAction');
//GET
router.get('/login', (req, res) => {
  res.render('login')
});
router.get('/register', (req, res) => {
  res.render('register')
});
router.get('/', forwardAuthenticated, (req, res) => {
  res.render('preloader')
});
router.get('/welcome',(req,res)=>{
  res.render('welcome')
});
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Delivery.find({ $or: [{ idSender: req.user._id }, { idRecipient: req.user._id }, { idCarrier: req.user._id }] })
    .then(deliveryLists => {

      res.render('dashboard', { 
        deliveryLists: deliveryLists, 
        name: req.user.name, 
        idUser: req.user._id, 
        shipmentsSend:req.user.shipmentsSend, 
        shipmentsReceived:req.user.shipmentsReceived, 
        shipmentsMade:req.user.shipmentsMade, 
        profit: req.user.profit
      })
      
    }).catch(err => console.log(err));
});
router.get('/send',ensureAuthenticated, (req, res) => {
  res.render('send',{nameUser:req.user.name})
});
router.get('/confirmrequest', (req, res) => {
  res.render('confirmrequest')
});
router.get('/deliver', ensureAuthenticated, (req, res) => {
  Delivery.find({ idCarrier: req.user._id })
    .then(deliveryLists => {
      res.render('deliver', { deliveryLists: deliveryLists, nameUser: req.user.name})
    }).catch(err => console.log(err));
});
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash('success_msg', 'Sei stato disconnesso!');
  res.redirect('/login');
});
//POST
router.post('/register', (req, res) => {
  const { name, surname, email, password, password2 } = req.body;
  let errors = [];
  //Check required fields
  if (!name || !surname || !email || !password || !password2) {
    errors.push({ msg: 'Per favore rimepi tutti i campi!' });
    res.render('register', {
      errors,
      name,
      surname,
      email,
      password,
      password2
    });
  } else {
    //Check passwords match
    if (password.length < 6) {
      errors.push({ msg: 'La password deve essere almeno di 6 caratteri' });
    }
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        surname,
        email,
        password,
        password2
      });
    } else {
      // Validate passed
      User.findOne({ email: email })
        .then(user => {
          if (user) {
            //User exist
            errors.push({ msg: 'Email già utilizzata' });
            res.render('register', {
              errors,
              name,
              surname,
              email,
              password,
              password2
            });
          } else {
            const newUser = new User({
              name: name.toLowerCase().trim(),
              surname: surname.toLowerCase(),
              email: email,
              password: password
            });

            //Hash password
            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;

              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Account creato con successo');
                  res.redirect('/login');
                })
                .catch(err => console.log(err));
            })
            )
          }
        })
    }
  }

});
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});
router.post('/send', ensureAuthenticated, (req, res) => {
  
  let { start,end,distance,name,surname,email,date,height,width,depth,type} = req.body;
  let errors = [];
  /*Check if the user exist*/
  name = name.toLowerCase().trim()
  surname = surname.toLowerCase().trim()
 if(distance == 0){
  errors.push({ msg: 'Abbiamo riscontrato un errore riprovare' });
  res.render('send', {
    errors,nameUser:req.user.name,surname,email,date,height,width,depth,type
  });
 }else{
  if (name == req.user.name && surname == req.user.surname) {
    // ERRORE L'UNTENTE INSERITO E' QUELLO DI SESSIONE
    name = name.charAt(0).toUpperCase() + name.slice(1);
    surname = surname.charAt(0).toUpperCase() + surname.slice(1);
    errors.push({ msg: 'Hai inserito le tue credenziali!' });
    res.render('send', {
      errors,nameUser:req.user.name,surname,email,date,height,width,depth,type
    });
  } else {
    User.findOne({ name: name, surname: surname,email:email })
      .then(recipient => {
        if (!recipient) {
          name = name.charAt(0).toUpperCase() + name.slice(1);
          surname = surname.charAt(0).toUpperCase() + surname.slice(1);
          errors.push({ msg: 'Credenziali errate / Utente inesistente!' });
          res.render('send', {
            errors,nameUser:req.user.name,name,surname,email,date,height,width,depth,type
          });
        } else {
          //Redirect to confirm page
          name = name.charAt(0).toUpperCase() + name.slice(1);
          surname = surname.charAt(0).toUpperCase() + surname.slice(1);
          var price = Price.priceCalc(distance).toFixed(2);
          console.log(price)
          res.render('confirmrequest',{
            start,end,distance,price,nameUser:req.user.name,name,surname,email,date,height,width,depth,type
          });
        }
      });

    }
 }
  
});
router.post('/confirmrequest',ensureAuthenticated, (req, res) => {
  console.log(req.user._id)
  var name = req.body.name.toLowerCase().trim();
  var surname = req.body.surname.toLowerCase().trim();
  var price = parseFloat(req.body.price);
  price = price.toFixed(2)
  User.findOne({name:name,surname:surname,email:req.body.email})
  .then(recipient=>{
    console.log(price);
    const newDelivery = new Delivery({
      idSender: req.user._id,
      nameSender:req.user.name,
      surnameSender:req.user.surname,
      idRecipient: recipient._id,
      nameRecipient:name,
      surnameRecipient:surname,
      startPlace: req.body.start,
      endPlace: req.body.end,
      distance: req.body.distance,
      price: price,
      height:req.body.height,
      width:req.body.width,
      depth:req.body.depth,
      type:req.body.type,
      date:req.body.date
    });
    newDelivery.save()
    .then(Delivery=>{
      req.flash('success_msg','La spedizione è stata aggiunta con successo! Attendere che venga accettata!')
      res.redirect('/dashboard');
    })
    .catch(err=>console.log(err));
  });
});
router.post('/accetta', ensureAuthenticated, (req, res) => {
  const { deliveryCode } = req.body
  Delivery.findOneAndUpdate({
    _id: deliveryCode
  }, { $set: { status: "Accettata" } }, (err, doc) => {
    if (err) console.log(err)
    else {
      req.flash('success_msg', 'La spedizione è stata accettata!');
      res.redirect('/dashboard');
    }
  });

});
router.post('/rifiuta', ensureAuthenticated, (req, res) => {
  const { deliveryCode } = req.body
  Delivery.findOneAndUpdate({
    _id: deliveryCode
  }, { $set: { status: "Cancellata" } }, (err, doc) => {
    if (err) console.log(err)
    else {
      req.flash('success_msg', 'La spedizione è stata cancellata!');
      res.redirect('/dashboard');
    }
  });
});
router.post('/deliver', ensureAuthenticated, (req, res) => {
  let { start, end, date } = req.body;
  let errors = [];
  Delivery.find({
    startPlace:{$regex:".*"+start},
    endPlace:{ $regex:".*"+end},    
    idSender:{$ne:req.user._id},
    idRecipient:{$ne:req.user._id},
    date:date,
    status:'Accettata'
  }).then(deliveryList=>{
    if(deliveryList.length==0){
      Delivery.find({
        startPlace:{$regex:".*"+start},
        endPlace:{ $regex:".*"+end},    
        idSender:{$ne:req.user._id},
        idRecipient:{$ne:req.user._id},
        status:'Accettata'
      }).then(deliveryList=>{
        if(deliveryList.length==0){
          Delivery.find({
            $and:[
              {$or:[{
                startPlace:{$regex:".*"+start}
                },
              {
                endPlace:{ $regex:".*"+end}
              }],
              idSender:{$ne:req.user._id},
              idRecipient:{$ne:req.user._id},
              status:'Accettata'
            }]
          }).then(deliveryList=>{
            if(deliveryList.length==0){
              errors.push({msg:"Siamo spiacenti ma non abbiamo trovato alcuna spedizione che soddisfi le sue richieste per le località indicate."})
              res.render('deliverylist', { errors,deliveryList: deliveryList, start: start, end: end, date: date, nameUser: req.user.name })
            }else{
              errors.push({msg:"Non è stata trovata alcuna spedizione che soddisfi le sue richieste, ma potrebbe dare un'occhiata alle seguenti. Fare attenzione alle località di partenza ed arrivo."})
              res.render('deliverylist', { errors,deliveryList: deliveryList, start: start, end: end, date: date, nameUser: req.user.name })
            }
          })
        }else{
          errors.push({msg:"Non sono state trovate spedizioni per questa data! Queste sono le spedizioni dalle località indicate. Fare attenzione alla data."})
          res.render('deliverylist', { errors,deliveryList: deliveryList, start: start, end: end, date: date, nameUser: req.user.name })
        }
      })
    } 
    else{
      console.log(deliveryList)
      res.render('deliverylist', { deliveryList: deliveryList, start: start, end: end, date: date,nameUser:req.user.name})
    } 
  })
});
router.post('/getDetail',ensureAuthenticated,(req,res)=>{
  let{deliveryCode} = req.body;
  Delivery.find({
    _id:deliveryCode
  }).then(delivery=>{
    res.render('deliveryDetail',{delivery,nameUser:req.user.name})
  })
})
router.post('/carrierAccept', ensureAuthenticated, (req, res) => {
  let {deliveryCode,expectedArrival} = req.body;
  let errors = [];
  Delivery.find({
    _id: deliveryCode,
    status:'Accettata'
  })
  .then(delivery=>{
    console.log(delivery)
    if(delivery.length==0){
      errors.push("La spedizione non è più disponibile!"),
      res.render('deliver',{errors,nameUser:req.user.name});
    }else{
      Delivery.findOneAndUpdate({
        _id: deliveryCode,
      }, { $set: 
        { 
        status: "Accettata dal corriere", 
        arrivoPrevisto: expectedArrival,  
        idCarrier: req.user._id 
        } 
      }, (err, doc) => {
        if (err) console.log(err)
        else {
          req.flash('success_msg', "Hai accetto la spedizione! Saprai se il destinatario ha accettato la spedizione accedento alla sezione Consegna!");
          res.redirect('/dashboard');
        }
      });
    }
  })
});
router.post('/confirmExpectedArrival',(req,res)=>{
 let{deliveryCode}=req.body;
 Delivery.findOneAndUpdate(
   {
  _id: deliveryCode,
  status:'Accettata dal corriere'
  },
  {
    $set:{
    status: "Arrivo previsto accettato"
  }},(err,doc)=>{
    if(err) console.log(err)
    else {

      req.flash('success_msg', "Aggiorneremo il corriere che la data del ritiro è stata accettata!");
      res.redirect('/dashboard');
    }
  })
});
router.post('/deniedExpectedArrival',(req,res)=>{
   let{deliveryCode}=req.body;
   Delivery.findOneAndUpdate(
    {
   _id: deliveryCode,
   status:'Accettata dal corriere'
   },
   {
     $set:{
     status: "Arrivo previsto rifiutato"
   }},(err,doc)=>{
     if(err) console.log(err)
      else {
        req.flash('success_msg', "Aggiorneremo il corriere che la data del ritiro è stata rifiutata!");
        res.redirect('/dashboard');
      }
     
   })
});
router.post('/confirmWithdrawal', ensureAuthenticated, (req, res) => {  
  let { deliveryCode, date } = req.body;
  console.log(date)
  if (validateDate.checkIfIsToday(date)) {
    Delivery.findOneAndUpdate({
      _id: deliveryCode    
    }, { $set: { status: "Ritirata" } }, (err, doc) => {
      if (err) console.log(err)
      else {
        req.flash('success_msg', "Perfetto la spedizine è stata ritirata controllare la sezione delle consegne per controllare l'arrivo previsto!");
        res.redirect('/dashboard');
      }
    }
    )
  } else {
    req.flash('error_msg', 'La spedizione che stai confermando non è per oggi!');
    res.redirect('/dashboard');
  }
});
router.post('/cancelWithdrawal', ensureAuthenticated, (req, res) => {
  let { deliveryCode } = req.body;
  Delivery.findOneAndUpdate({
    _id: deliveryCode,
  }, { $set: { status: "Annullata" } }, (err, doc) => {
    if (err) console.log(err)
    else {
      req.flash('success_msg', 'La spedizione è stata annullata');
      res.redirect('/dashboard');
    }
  })
});
router.post('/confirmArrival', ensureAuthenticated, (req, res) => {
  let{deliveryCode, expectedArrival} = req.body;
  if(validateDate.checkIfIsToday(expectedArrival)){
    DeliveryAction.confirmArrival(deliveryCode);
    req.flash('success_msg', "Grazie mille per aver confermato l'arrivo della spedizione. Grazie per aver utilizzato Lacus");
    res.redirect('/dashboard');

  }else{
    req.flash('error_msg', 'La spedizione che stai confermando non è per oggi!');
    res.redirect('/dashboard');
  }
});
router.post('/notArrival',ensureAuthenticated,(req,res)=>{
  req.flash('error_msg', 'La sua spedizione potrebbe richiedere ulteriore tempo.. La preghiamo di attendere!');
  res.redirect('/dashboard');
});
module.exports = router;