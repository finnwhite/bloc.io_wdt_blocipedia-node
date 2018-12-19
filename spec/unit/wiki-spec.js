const sequelize = require( "../../src/db/models" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Wiki = require( "../../src/db/models" ).Wiki;


describe( "Wiki", () => {

  beforeEach( ( done ) => {
    this.user;
    sequelize.sync( { force: true } ).then( () => {

      const values = {
        username: "standard",
        email: "standard@example.com",
        password: "1234567890",
        role: "standard",
      };

      User.create( values )
      .then( ( user ) => {
        expect( user ).not.toBeNull();
        this.user = user;
        done();
      } );
    } )
    .catch( ( err ) => { console.log( err ); done(); } );
  } );

  describe( ".create()", () => {

    it( "should create new Wiki when supplied valid values", ( done ) => {

      const values = {
        title: "Toddler Tunes",
        body: "Head, shoulders, knees and toes, knees and toes.",
        creatorId: this.user.id,
      };

      Wiki.create( values )
      .then( ( wiki ) => {
        expect( wiki.title ).toBe( values.title );
        expect( wiki.body ).toBe( values.body );
        expect( wiki.private ).toBe( false ); // default value
        expect( wiki.creatorId ).toBe( this.user.id );
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

    it( "should NOT create new Wiki when supplied INVALID values", ( done ) => {

      const values = {
        title: "Z",
        body: "Zzz",
      };

      Wiki.create( values )
      .then( ( wiki ) => { // should never succeed, execute
        done();
      } )
      .catch( ( err ) => {
        expect( err.message ).toContain( "Validation error" );
        expect( err.message ).toContain( "title" ); // len < 2
        expect( err.message ).toContain( "body" ); // len < 4
        done();
      } );
    } );

  } );
  /* END: Wiki.create() ----- */

} );
/* END: Wiki ----- */
