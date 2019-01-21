const sequelize = require( "../../src/db/models" ).sequelize;
const User = require( "../../src/db/models" ).User;


describe( "User", () => {

  beforeEach( ( done ) => {
    sequelize.sync( { force: true } ).then( () => { done(); } )
    .catch( ( err ) => { console.log( "ERROR: %O", err ); done(); } );
  } );

  describe( ".create()", () => {

    it( "should create a new User " +
        "when supplied valid values", ( done ) => {

      const values = {
        username: "valid",
        email: "valid@example.com",
        password: "1234567890",
      };

      User.create( values )
      .then( ( user ) => {
        expect( user.username ).toBe( values.username );
        expect( user.email ).toBe( values.email );
        expect( user.password ).toBe( values.password );
        expect( user.role ).toBe( "standard" ); // default value
        done();
      } )
      .catch( ( err ) => {
        console.log( "ERROR: %O", err );
        done();
      } );
    } );

    it( "should NOT create a new User " +
        "when supplied INVALID values", ( done ) => {

      const values = {
        username: "b",
        email: "bad@example",
        password: "123",
        role: "imvalid",
      };

      User.create( values )
      .then( ( user ) => { // should never succeed, execute
        expect( user ).toBeNull();
        done();
      } )
      .catch( ( err ) => {
        //console.log( "ERROR: %O", err );
        expect( err.message ).toContain( "Validation error" );
        expect( err.message ).toContain( "username" ); // len < 2
        expect( err.message ).toContain( "email" ); // !isEmail
        expect( err.message ).toContain( "password" ); // len < 4
        expect( err.message ).toContain( "role" ); // no such role
        done();
      } );
    } );

    it( "should NOT create a new User " +
        "when username or email already in use", ( done ) => {

      const values = {
        username: "popular",
        email: "popular@example.com",
        password: "original",
      };

      User.create( values )
      .then( ( user ) => {
        expect( user ).not.toBeNull();

        const values = {
          username: "popular",
          email: "popular@example.com",
          password: "copycat",
        };

        User.create( values )
        .then( ( user ) => { // should never succeed, execute
          expect( user ).toBeNull();
          done();
        } )
        .catch( ( err ) => {
          //console.log( "ERROR: %O", err );
          const msg = err.original.detail; // database error message
          expect( msg ).toMatch( /Key.*already exists/ ); // unique constraint
          done();
        } );
      } );
    } );

  } );
  /* END: User.create() ----- */

} );
/* END: User ----- */
