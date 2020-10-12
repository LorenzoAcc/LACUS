const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express(); 
const CronJob = require('cron').CronJob;
const updateDb = require('./config/updateDb.js');

// CARTELLE PER LA GESTIONE DELLE RISORSE
app.use('/css',express.static(__dirname+'/assets/css'));
app.use('/img',express.static(__dirname+'/assets/img'));
app.use('/js',express.static(__dirname+'/assets/js'));
app.use('/fonts',express.static(__dirname+'/assets/fonts'));
app.use('/public',express.static(__dirname+'/assets/public'));
app.use('/serviceWorker',express.static(__dirname+'/serviceWorker.js'));

//Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false })
    .then(() => console.log('Mongo connected'))
    .catch(err => console.log(err));    

//EJS
app.use(expressLayout);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))
//Passport 
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


//ROUTES
app.use('/',require('./routes/index-master'))
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server stared on port${PORT}`));


/*CRON JOB*/
new CronJob('0 0 * * * *', function() {
    updateDb.updateDb();
}, null, true, 'Europe/San_Marino');



