const server = require( "../../src/server.js" );
const request = require( "request" );
const base = "http://localhost:3000";


describe( "routes:validation", () => {

  describe( "POST /validate", () => {

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
  /* END: POST /validate ----- */

} );
/* END: routes:validation ----- */
