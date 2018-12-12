const { check, validationResult } = require( "express-validator/check" );

module.exports = {

  result( req, res, next ) {
    const formatter = ( err ) => { return `${ err.param } ${ err.msg }`; };
    const err = validationResult( req ).formatWith( formatter );
    if ( !err.isEmpty() ) {
      req.flash( "style", "danger" );
      req.flash( "alert", err.array() );
      return res.redirect( ( req.headers.referer || "/" ) );
    }
    next();
  },

  validate: [
    check( "username" )
    .isEmail()
    .withMessage( "must be a valid email address" ),

    check( "password" )
    .isLength( { min: 6 } )
    .withMessage( "must be at least 6 characters in length" )
  ],

};
