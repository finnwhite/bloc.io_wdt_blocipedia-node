const request = require( "request" );
const base = "http://localhost:3000";
const path = "/mock/auth";
const url = base + path;

module.exports = {

  init( app ) {

    let id, username, role;

    function middleware( req, res, next ) {

      id = req.body.mockId || id;
      username = req.body.mockUsername || username;
      role = req.body.mockRole || role;

      if ( id && ( id != 0 ) ) { req.user = { id, username, role }; }
      else if ( id == 0 ) {  // sign out
        delete req.user;
        role = username = id = null;
      }

      //console.log( "USER: %O", req.user );
      if ( next ) { next(); }
    }

    app.use( middleware );
    app.get( path, ( req, res, next ) => { res.redirect( "/" ); } );
  },

  user( user ) {
    return {
      mockId: user.id,
      mockUsername: user.username,
      mockRole: user.role,
    };
  },

  signIn( user, callback ) {
    const options = { url, form: user };
    request.get( options, callback );
  },
  signOut( callback ) {
    const options = { url, form: { mockId: 0 } };
    request.get( options, callback );
  },

};
