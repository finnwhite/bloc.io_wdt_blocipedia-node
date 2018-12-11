require( "dotenv" ).config();
const path = require( "path" );

module.exports = {

  init( app, express ) {

    app.set( "views", path.join( __dirname, "..", "views" ) );
    app.set( "view engine", "ejs" );

    app.use( express.static( path.join( __dirname, "..", "assets" ) ) );

  },

};
