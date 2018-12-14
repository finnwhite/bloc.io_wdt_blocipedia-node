const server = require( "../../src/server.js" );
const request = require( "request" );
const base = "http://localhost:3000";


describe( "routes:root", () => {

  describe( "GET /", () => {

    it( "should render the Home page", ( done ) => {

      const url = `${ base }/`;

      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( "Welcome to Blocipedia!" );
        done();
      } );
    } );

  } );
  /* END: GET / ----- */

} );
/* END: routes:root ----- */
