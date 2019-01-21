const User = require( "../db/models" ).User;
const Wiki = require( "../db/models" ).Wiki;
const WikiPolicy = require( "../policies/WikiPolicy.js" );
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

  account( req, res, next ) {
    User.queries.select( req.user.id, ( err, user ) => {
      if ( err ) {
        req.flash( "style", "danger" );
        req.flash( "alert", err );
        res.redirect( ( req.headers.referer || "/" ) );
      }
      else {
        const showUpgrade = ( user.role === "standard" );
        const showDowngrade = ( user.role === "premium" );
        res.render( "users/account", { user, showUpgrade, showDowngrade } );
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
          res.redirect( ( req.headers.referer || "/users/account" ) );
        }
        else {
          User.queries.update( user.id, { role: plan }, ( err, user ) => {
            if ( err ) {
              req.flash( "style", "danger" );
              req.flash( "alert", err );
              res.redirect( ( req.headers.referer || "/users/account" ) );
            }
            else {
              req.flash( "style", "success" );
              req.flash( "alert", ( "You have successfully upgraded " +
                `to the ${ plan.toUpperCase() } plan!` )
              );
              res.redirect( "/users/account" );
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
        res.redirect( ( req.headers.referer || "/users/account" ) );
      }
      else {
        req.flash( "alert", ( "You have successfully downgraded " +
          `to the ${ plan.toUpperCase() } plan.` )
        );

        Wiki.queries.makePublic( user.id, ( err, affected ) => {
          if ( err ) {
            req.flash( "style", "warning" );
            req.flash( "alert", `ERROR: ${ err }` );
          }
          else {
            const count = affected[ 0 ];
            req.flash( "style", "success" );
            req.flash( "alert", `${ count } private wikis were made public.` );
          }
          res.redirect( "/users/account" );
        } );
      }
    } );
  },

  dashboard( req, res, next ) {
    User.queries.dashboard( req.user.id, ( err, user ) => {
      if ( err ) {
        req.flash( "style", "danger" );
        req.flash( "alert", err );
        res.redirect( ( req.headers.referer || "/" ) );
      }
      else {

        /* force sort wikis in order by latest update, TODO: via query */
        const updatedAtDesc = function( a, b ) {
          const aValue = a.updatedAt;
          const bValue = b.updatedAt;
          if ( aValue < bValue ) { return 1; }
          if ( aValue > bValue ) { return -1; }
          return 0;
        }
        user.wikiCreations.sort( updatedAtDesc );
        user.wikiCollaborations.sort( updatedAtDesc );

        const showNew = new WikiPolicy( req.user ).new();
        const showActions = showNew;
        res.render( "users/dashboard", { user, showActions, showNew } );
      }
    } );
  },

};
