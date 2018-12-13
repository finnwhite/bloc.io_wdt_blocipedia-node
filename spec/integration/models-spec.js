const server = require( "../../src/server.js" );
const request = require( "request" );
const base = "http://localhost:3000";

const mockAuth = require( "../support/mock-auth.js" );
const sequelize = require( "../../src/db/models" ).sequelize;


describe( "routes:models", () => {

  beforeAll( ( done ) => {
    mockAuth.signOut( done );
  } );
  beforeEach( ( done ) => {
    sequelize.sync( { force: true } )
    .then( () => { done(); } )
    .catch( ( err ) => {
      console.log( err );
      done();
    } );
  } );
  afterEach( ( done ) => {
    mockAuth.signOut( done );
  } );

  describe( "METHOD /path", () => {

    it( "should pass", ( done ) => {
      done();
    } );

  } );
  /* END: METHOD /path ----- */

} );
/* END: routes:models ----- */
