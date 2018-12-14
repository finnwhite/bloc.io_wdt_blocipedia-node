const request = require( "request" );
const base = "http://localhost:3000";
const path = "/mock/auth";
const url = base + path;

module.exports = {

  init( app ) {

    let id, username, role;

    function middleware( req, res, next ) {

      id = req.body.userId || id;
      username = req.body.username || username;
      role = req.body.role || role;

      if ( id && ( id != 0 ) ) { req.user = { id, username, role }; }
      else if ( id == 0 ) {  // sign out
        delete req.user;
        role = username = id = null;
      }

      if ( next ) { next(); }
    }

    app.use( middleware );
    app.get( path, ( req, res, next ) => { res.redirect( "/" ); } );
  },

  signIn( user, callback ) {
    const options = { url, form: user };
    request.get( options, callback );
  },
  signOut( callback ) {
    const options = { url, form: { userId: 0 } };
    request.get( options, callback );
  },

};
