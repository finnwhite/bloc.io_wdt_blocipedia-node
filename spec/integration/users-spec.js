const server = require( "../../src/server.js" );
const request = require( "request" );
const base = "http://localhost:3000/users";

const sequelize = require( "../../src/db/models" ).sequelize;
const User = require( "../../src/db/models" ).User;

const auth = require( "../../src/util/authentication.js" );
const mockAuth = require( "../support/mock-auth.js" );


describe( "routes:users", () => {

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

  describe( ":guest", () => {

    describe( "GET /users/sign-up", () => {

      it( "should render the Sign Up page", ( done ) => {

        const url = `${ base }/sign-up`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "Sign Up" );
          done();
        } );
      } );

    } );
    /* END: GET /users/sign-up ----- */

    describe( "POST /users/create", () => {

      it( "should create new User when supplied valid values", ( done ) => {

        const url = `${ base }/create`;
        const form = {
          username: "valid",
          email: "valid@example.com",
          password: "123456",
          confirmation: "123456",
        };
        const options = { url, form };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          User.findOne( { where: { username: form.username } } )
          .then( ( user ) => {
            expect( user ).not.toBeNull();

            const match = auth.match( form.password, user.password );

            expect( user.username ).toBe( form.username ); // "testuser"
            expect( user.password ).not.toBe( form.password ); // "123456"
            expect( match ).toBeTruthy(); // password ENCRYPTED!
            done();
          } )
          .catch( ( err ) => {
            console.log( err );
            done();
          } );
        } );
      } );

      it( "should NOT create new User when supplied INVALID values", ( done ) => {

        const url = `${ base }/create`;
        const form = {
          username: "b",
          email: "bad@example",
          password: "123",
        };
        const options = { url, form };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          User.findOne( { where: { username: form.username } } )
          .then( ( user ) => {
            expect( user ).toBeNull();
            done();
          } )
          .catch( ( err ) => {
            console.log( err );
            done();
          } );
        } );
      } );

    } );
    /* END: POST /users/create ----- */

  } );
  /* END: routes:users:guest ----- */

} );
/* END: routes:users ----- */
