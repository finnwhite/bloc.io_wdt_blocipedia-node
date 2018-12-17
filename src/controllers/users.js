const User = require( "../db/models" ).User;
const auth = require( "../util/authentication.js" );
const email = require( "../util/email.js" );

module.exports = {

  renderSignUp( req, res, next ) { res.render( "users/sign-up" ); },

  create( req, res, next ) {

    const values = {
      username: req.body.username,
      email: req.body.email,
      password: User.encryptPassword( req.body.password )
    };

    User.queries.insert( values, ( err, user ) => {
      if ( err ) {
        req.flash( "style", "danger" );
        req.flash( "alert", err );
        res.redirect( ( req.headers.referer || "/users/sign-up" ) );
      }
      else {
        const to = `${ user.username } <${ user.email }>`;
        email.service.send( email.messages.welcome( to ), email.logResult() );
        auth.signIn( req, res, next );
      }
    } );
  },

  renderSignIn( req, res, next ) { res.render( "users/sign-in" ); },

  signIn( req, res, next ) { auth.signIn( req, res, next ); },

  signOut( req, res, next ) { auth.signOut( req, res, next ); },

};
