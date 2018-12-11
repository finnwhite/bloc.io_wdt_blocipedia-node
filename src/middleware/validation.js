const { check, validationResult } = require( "express-validator/check" );

module.exports = {

  result( req, res, next ) {
    const err = validationResult( req );
    if ( !err.isEmpty() ) {
      req.flash( "alert", err.array() );
      return res.redirect( ( req.headers.referer || "/" ) );
    }
    else { return next(); }
  },

  checks: [
    check( "email" )
    .isEmail()
    .withMessage( "must be a valid email address" ),

    check( "password" )
    .isLength( { min: 6 } )
    .withMessage( "must be at least 6 characters in length" )
  ],

};
