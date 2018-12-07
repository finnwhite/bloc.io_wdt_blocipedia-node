const express = require( "express" );
const app = express();

require( "./config/route_config.js" ).init( app );

module.exports = app;
