const sequelize = require( "../../src/db/models" ).sequelize;
const User = require( "../../src/db/models" ).User;


describe( "User", () => {

  beforeEach( ( done ) => {
    sequelize.sync( { force: true } )
    .then( () => { done(); } )
    .catch( ( err ) => {
      console.log( err );
      done();
    } );
  } );

  describe( ".create()", () => {

    it( "should create new User when supplied valid values", ( done ) => {

      const values = {
        username: "valid",
        email: "valid@example.com",
        password: "123456",
      };

      User.create( values )
      .then( ( user ) => {
        expect( user.username ).toBe( values.username ); // "valid"
        expect( user.password ).toBe( values.password ); // "123456"
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

    it( "should NOT create new User when supplied INVALID values", ( done ) => {

      const values = {
        username: "b",
        email: "bad@example",
        password: "123",
      };

      User.create( values )
      .then( ( user ) => { // should never succeed, execute
        done();
      } )
      .catch( ( err ) => {
        expect( err.message ).toContain( "Validation error" );
        expect( err.message ).toContain( "username" ); // len < 2
        expect( err.message ).toContain( "email" ); // !isEmail
        expect( err.message ).toContain( "password" ); // len < 4
        done();
      } );
    } );

  } );
  /* END: User.create() ----- */

} );
/* END: User ----- */
