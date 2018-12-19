const server = require( "../../src/server.js" );
const request = require( "request" );
const base = "http://localhost:3000/users";

const sequelize = require( "../../src/db/models" ).sequelize;
const User = require( "../../src/db/models" ).User;
const auth = require( "../support/mock-auth.js" );


describe( "routes:users", () => {

  beforeAll( ( done ) => {
    auth.signOut( done );
  } );
  beforeEach( ( done ) => {
    this.user;
    sequelize.sync( { force: true } ).then( () => { done(); } )
    .catch( ( err ) => { console.log( err ); done(); } );
  } );
  afterEach( ( done ) => {
    auth.signOut( done );
  } );

  describe( ":guest", () => {

    describe( "GET /users/sign-up", () => {

      it( "should render the Sign Up page", ( done ) => {

        const url = `${ base }/sign-up`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "Blocipedia | Sign Up" );
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
          password: "1234567890",
          confirmation: "1234567890",
        };
        const options = { url, form };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          User.findOne( { where: { username: form.username } } )
          .then( ( user ) => {
            expect( user ).not.toBeNull();

            const encrypted = user.matchPassword( form.password );
            expect( user.username ).toBe( form.username );
            expect( user.email ).toBe( form.email );
            expect( user.password ).not.toBe( form.password );
            expect( encrypted ).toBe( true ); // password ENCRYPTED!
            expect( user.role ).not.toBe( "guest" ); // default role
            expect( user.role ).toBe( "standard" ); // default plan
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
          } );
        } );
      } );

    } );
    /* END: POST /users/create ----- */

  } );
  /* END: routes:users:guest ----- */

  describe( ":standard", () => {

    beforeEach( ( done ) => {

      const values = {
        username: "standard",
        email: "standard@example.com",
        password: "1234567890",
        role: "standard",
      };

      User.create( values )
      .then( ( user ) => {
        expect( user.role ).toBe( "standard" );
        this.user = user;

        auth.signIn( auth.user( user ), ( err, res, body ) => {
          expect( err ).toBeNull();
          done();
        } );
      } );
    } );

    describe( "GET /users/sign-in", () => {

      it( "should render the Sign In page", ( done ) => {

        const url = `${ base }/sign-in`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "Blocipedia | Sign In" );
          done();
        } );
      } );

    } );
    /* END: GET /users/sign-in ----- */

  } );
  /* END: routes:users:standard ----- */

} );
/* END: routes:users ----- */
