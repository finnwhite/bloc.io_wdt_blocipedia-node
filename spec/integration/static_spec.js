const request = require( "request" );
const server = require( "../../src/server.js" );

const base = "http://localhost:3000";


describe( "routes:static:", () => {

  describe( "GET '/'", () => {

    it( "should return status code 200", ( done ) => {

      const url = `${ base }/`;

      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( "Blocipedia" );
        done();
      } );
    } );

  } );

} );
