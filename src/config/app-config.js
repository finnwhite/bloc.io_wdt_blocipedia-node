require( "dotenv" ).config();
require( "./env-config.js" ).init();

const path = require( "path" );
const parser = require( "body-parser" );
const validator = require( "express-validator" );
const session = require( "express-session" );
const flash = require( "express-flash" );
const passport = require( "./passport-config.js" );
const auth = require( "../util/authentication.js" );
const logger = require( "morgan" );

module.exports = {

  init( app, express ) {

    app.set( "views", path.join( __dirname, "..", "views" ) );
    app.set( "view engine", "ejs" );
    app.use( express.static( path.join( __dirname, "..", "assets" ) ) );

    app.use( parser.urlencoded( { extended: true } ) );

    app.use( validator() );

    app.use( session( {
      secret: ( process.env.COOKIE_SECRET || "BL0C1p3d1a 53CR3T!" ),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1.21e+9 } // 14 days
    } ) );

    app.use( flash() );

    passport.init( app );
    app.use( auth.storeUser );

    app.use( logger( "dev" ) );

    if ( process.env.NODE_ENV === "test" ) {
      require( "../../spec/support/test-config.js" ).init( app );
    }
  },

};
