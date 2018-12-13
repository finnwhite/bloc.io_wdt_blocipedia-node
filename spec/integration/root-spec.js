const server = require( "../../src/server.js" );
const request = require( "request" );
const base = "http://localhost:3000";


describe( "routes:root", () => {

  describe( "GET /", () => {

    it( "should return status code 200 AND" +
        "contain the title 'Welcome to Blocipedia!'", ( done ) => {

      const url = `${ base }/`;

      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( "<title>Welcome to Blocipedia!</title>" );
        done();
      } );
    } );

  } );
  /* END: GET / ----- */

} );
/* END: routes:root ----- */
