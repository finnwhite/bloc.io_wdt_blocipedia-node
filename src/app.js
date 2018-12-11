const express = require( "express" );
const app = express();

require( "./config/app-config.js" ).init( app, express );
require( "./config/route-config.js" ).init( app );

module.exports = app;
