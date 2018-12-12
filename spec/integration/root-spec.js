const request = require( "request" );
const server = require( "../../src/server.js" );

const base = "http://localhost:3000";


describe( "routes:root:", () => {

  describe( "GET '/'", () => {

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

  describe( "POST '/validate'", () => {

    it( "should pass validation when sent valid values", ( done ) => {

      const url = `${ base }/validate`;
      const form = { username: "test@example.com", password: "123456" };
      const options = { url, form };

      request.post( options, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        done();
      } );
    } );

    it( "should NOT pass validation when sent INVALID values", ( done ) => {

      const url = `${ base }/validate`;
      const form = { username: "test@example", password: "1234" };
      const options = { url, form };

      request.post( options, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 302 );
        done();
      } );
    } );

  } );

} );
