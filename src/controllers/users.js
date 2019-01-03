const User = require( "../db/models" ).User;
const auth = require( "../util/authentication.js" );
const email = require( "../util/email.js" );
const payments = require( "../util/payments.js" );

module.exports = {

  renderSignUp( req, res, next ) { res.render( "users/sign-up" ); },

  create( req, res, next ) {

    const values = {
      username: req.body.username,
      email: req.body.email,
      password: User.encryptPassword( req.body.password ),
      role: ( req.body.plan || "standard" ),
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

        const msg = "You have successfully created an account!";
        auth.signIn( req, res, next, { successFlash: msg } );
      }
    } );
  },

  renderSignIn( req, res, next ) { res.render( "users/sign-in" ); },

  signIn( req, res, next ) { auth.signIn( req, res, next ); },

  signOut( req, res, next ) { auth.signOut( req, res, next ); },

  profile( req, res, next ) { // TODO: implement policy check?
    User.queries.select( req.user.id, ( err, user ) => {
      if ( err ) {
        req.flash( "style", "danger" );
        req.flash( "alert", err );
        res.redirect( ( req.headers.referer || "/" ) );
      }
      else {
        const showUpgrade = ( user.role === "standard" );
        const showDowngrade = ( user.role === "premium" );
        res.render( "users/profile", { user, showUpgrade, showDowngrade } );
      }
    } );
  },

  upgradePlan( req, res, next ) { // TODO: implement idempotency key?

    const user = req.user;
    const plan = req.body.plan;
    const token = req.body.stripeToken;

    payments.service.charges.create(
      payments.charges.premium( user, token ), ( err, result ) => {
        if ( err ) {
          req.flash( "style", "danger" );
          req.flash( "alert", err );
          res.redirect( ( req.headers.referer || "/users/profile" ) );
        }
        else {
          User.queries.update( user.id, { role: plan }, ( err, user ) => {
            if ( err ) {
              req.flash( "style", "danger" );
              req.flash( "alert", err );
              res.redirect( ( req.headers.referer || "/users/profile" ) );
            }
            else {
              req.flash( "style", "success" );
              req.flash( "alert", ( "You have successfully upgraded " +
                `to the ${ plan.toUpperCase() } plan!` )
              );
              res.redirect( "/users/profile" );
            }
          } );
        }
      }
    );
  },

  downgradePlan( req, res, next ) {

    const user = req.user;
    const plan = req.body.plan;

    User.queries.update( user.id, { role: plan }, ( err, user ) => {
      if ( err ) {
        req.flash( "style", "danger" );
        req.flash( "alert", err );
        res.redirect( ( req.headers.referer || "/users/profile" ) );
      }
      else {
        req.flash( "style", "success" );
        req.flash( "alert", ( "You have successfully downgraded " +
          `to the ${ plan.toUpperCase() } plan.` )
        );
        res.redirect( "/users/profile" );
      }
    } );
  },

};
