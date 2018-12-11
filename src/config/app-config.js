require( "dotenv" ).config();
const path = require( "path" );
const parser = require( "body-parser" );
const validator = require( "express-validator" );
const session = require( "express-session" );
const flash = require( "express-flash" );

module.exports = {

  init( app, express ) {

    app.set( "views", path.join( __dirname, "..", "views" ) );
    app.set( "view engine", "ejs" );

    app.use( parser.urlencoded( { extended: true } ) );

    app.use( validator() ); // Legacy API setup

    app.use( session( {
      secret: ( process.env.cookiesecret || "BL0C1p3d1a 53CR3T!" ),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1.21e+9 } // 14 days
    } ) );

    app.use( flash() );

    app.use( express.static( path.join( __dirname, "..", "assets" ) ) );

  },

};
