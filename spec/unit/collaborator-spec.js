const sequelize = require( "../../src/db/models" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Wiki = require( "../../src/db/models" ).Wiki;
const Collaborator = require( "../../src/db/models" ).Collaborator;


describe( "Collaborator", () => {

  beforeEach( ( done ) => {
    this.user = {};
    this.wiki = {};
    sequelize.sync( { force: true } ).then( () => {

      const values = {
        username: "creator",
        email: "creator@example.com",
        password: "1234567890",
        role: "premium",
      };

      User.create( values )
      .then( ( user ) => {
        expect( user ).not.toBeNull();
        this.user.creator = user;

        const values = {
          title: "Changing A Dirty Diaper",
          body: "What is THAT? Photos plus detailed descriptions.",
          private: true,
          creatorId: user.id,
        };

        Wiki.create( values )
        .then( ( wiki ) => {
          expect( wiki ).not.toBeNull();
          this.wiki = wiki;

          const values = {
            username: "collaborator",
            email: "collaborator@example.com",
            password: "1234567890",
            role: "standard",
          };

          User.create( values )
          .then( ( user ) => {
            expect( user ).not.toBeNull();
            this.user.collaborator = user;
            done();
          } );
        } );
      } );
    } )
    .catch( ( err ) => { console.log( "ERROR: %O", err ); done(); } );
  } );

  describe( ".create()", () => {

    it( "should create new Collaborator " +
        "when supplied valid values", ( done ) => {

      const values = {
        contentType: "wiki",
        contentId: this.wiki.id,
        userId: this.user.collaborator.id,
      };

      Collaborator.create( values )
      .then( ( collab ) => {
        expect( collab.contentType ).toBe( values.contentType );
        expect( collab.contentId ).toBe( values.contentId );
        expect( collab.userId ).not.toBe( this.user.creator.id );
        expect( collab.userId ).toBe( this.user.collaborator.id );
        expect( collab.role ).toBe( "default" ); // default value
        done();
      } )
      .catch( ( err ) => {
        console.log( "ERROR: %O", err );
        done();
      } );
    } );

    it( "should NOT create new Collaborator " +
        "if missing content or user data", ( done ) => {

      const values = {};

      Collaborator.create( values )
      .then( ( collab ) => { // should never succeed, execute
        expect( collab ).toBeNull();
        done();
      } )
      .catch( ( err ) => {
        //console.log( "ERROR: %O", err );
        expect( err.message ).toContain( "notNull Violation" );
        expect( err.message ).toContain( "contentType" ); // !null
        expect( err.message ).toContain( "contentId" ); // !null
        expect( err.message ).toContain( "userId" ); // !null
        done();
      } );
    } );

    it( "should NOT create a duplicate Collaborator " +
        "with the same content and user data", ( done ) => {

      const values = {
        contentType: "wiki",
        contentId: this.wiki.id,
        userId: this.user.collaborator.id,
      };

      Collaborator.count( { where: values } )
      .then( ( countBefore ) => {
        expect( countBefore ).toBeGreaterThanOrEqual( 0 );

        Collaborator.create( values )
        .then( ( collab ) => {
          expect( collab ).not.toBeNull();

          Collaborator.count( { where: values } )
          .then( ( countAfter ) => {
            expect( countAfter ).toBe( countBefore + 1 ); // created

            Collaborator.create( values )
            .then( ( collab ) => { // should never succeed, execute
              expect( collab ).toBeNull();
              done();
            } )
            .catch( ( err ) => {
              //console.log( "ERROR: %O", err );
              const msg = err.original.detail; // database error message
              expect( msg ).toMatch( /Key.*already exists/ ); // composite key
              expect( msg ).toContain( "contentType" );
              expect( msg ).toContain( "contentId" );
              expect( msg ).toContain( "userId" );

              Collaborator.count( { where: values } )
              .then( ( countFinal ) => {
                expect( countFinal ).toBe( countAfter ); // unchanged
                done();
              } );
            } );
          } );
        } );
      } );
    } );

  } );
  /* END: Collaborator.create() ----- */

} );
/* END: Collaborator ----- */
