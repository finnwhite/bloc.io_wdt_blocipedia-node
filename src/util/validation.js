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

  createUser: [
    check( "username" )
    .isLength( { min: 2 } )
    .withMessage( "must be at least 2 characters in length" ),

    check( "email" )
    .isEmail()
    .withMessage( "must be a valid email address" ),

    check( "password" )
    .isLength( { min: 4 } )
    .withMessage( "must be at least 4 characters in length" ),

    check( "confirmation" )
    .custom( ( value, { req } ) => { return ( value === req.body.password ) } )
    .withMessage( "and password must match" ),
  ],

  signIn: [
    check( "username" )
    .not().isEmpty()
    .withMessage( "must not be empty" ),

    check( "password" )
    .not().isEmpty()
    .withMessage( "must not be empty" ),
  ],

};
