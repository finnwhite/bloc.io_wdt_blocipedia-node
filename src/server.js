const app = require( "./app.js" );
const http = require( "http" );

const port = normalizePort( process.env.PORT || "3000" );
app.set( "port", port );

const server = http.createServer( app );
server.listen( port, () => {
  console.log( "server listening on port %O", server.address().port );
} );

function normalizePort( value ) {
  const port = parseInt( value, 10 );
  if ( isNaN( port ) ) { return value; }
  if ( port >= 0 ) { return port; }
  return false;
};

module.exports = server;
