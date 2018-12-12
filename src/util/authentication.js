const passport = require( "passport" );
const bcrypt = require( "bcryptjs" );

module.exports = {

  encrypt( value ) {
    return bcrypt.hashSync( value, bcrypt.genSaltSync() );
  },

  match( value, hash ) {
    return bcrypt.compareSync( value, hash );
  },

  storeUser( req, res, next ) {
    res.locals.user = req.user;
    next();
  },

  ensureUser( req, res, next ) {
    if ( !req.user ) {
      req.flash( "style", "warning" );
      req.flash( "alert", "You must be signed in to do that." );
      return res.redirect( ( req.headers.referer || "/sign-in" ) );
    }
    next();
  },

  signIn( req, res, next, options = {} ) {
    passport.authenticate( "local", ( err, user, info ) => {
      if ( err ) { return next( err ); }
      if ( !user ) {
        req.flash( "style", "danger" );
        req.flash( "alert", info.message );
        return res.redirect( ( req.headers.referer || "/sign-in" ) );
      }
      req.logIn( user, ( err ) => {
        if ( err ) { return next( err ); }
        req.flash( "style", "success" );
        req.flash( "alert", "You have successfully signed in!" );
        return res.redirect( ( options.successRedirect || "/" ) );
      } );
    } )( req, res, next );
  },

  signOut( req, res, next, options = {} ) {
    req.logout();
    req.flash( "alert", "You have successfully signed out." );
    res.redirect( ( options.successRedirect || "/" ) );
  },

};
