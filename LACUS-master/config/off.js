module.exports = {
  //Determinare se l'utente sia sia connesso o meno
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', "Per favore effettua l'accesso!");
      res.redirect('/login');
    },
    //Determinare se l'utente è in sessione
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/dashboard');      
    }
  };