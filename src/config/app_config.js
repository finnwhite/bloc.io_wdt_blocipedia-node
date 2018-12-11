require( "dotenv" ).config();
const path = require( "path" );
const viewsDir = path.join( __dirname, "..", "views" );
const assetsDir = path.join( __dirname, "..", "assets" );
const bodyParser = require( "body-parser" );

module.exports = {

  init( app, express ) {

    app.set( "views", viewsDir );
    app.set( "view engine", "ejs" );

    app.use( bodyParser.urlencoded( { extended: true } ) );

    app.use( express.static( assetsDir ) );

  },

};
