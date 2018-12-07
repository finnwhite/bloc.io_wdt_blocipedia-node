const app = require( "./app.js" );
const http = require( "http" );

const server = http.createServer( app );
server.listen( 3000, () => {
  console.log( `server listening on port ${ server.address().port }` );
} );
