const bcrypt = require( "bcryptjs" );

module.exports = {

  encrypt( str ) {
    return bcrypt.hashSync( str, bcrypt.genSaltSync() );
  },

  match( str, encrypted ) {
    return bcrypt.compareSync( str, encrypted );
  },

};
