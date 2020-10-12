const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Carico lo User Model
const User = require('../models/Users');
module.exports = function (passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {
            //Controllo se l'email inserita nel login esiste
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message:'Questa mail non esiste!'});
                    }
                    // Match with the password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if(isMatch){
                            return done(null,user);
                        }else{
                            return done(null,false,{message:'Password errata!'});
                        }
                    });

                })
                .catch(err => console.log(err));
        })
    );

    //Serialize e deserialize
    passport.serializeUser((user, done) =>{
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) =>{
        User.findById(id, (err, user)=> {
          done(err, user);
        });
      });
}
