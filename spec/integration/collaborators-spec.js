const server = require( "../../src/server.js" );
const request = require( "request" );
const base = "http://localhost:3000/wikis";

const sequelize = require( "../../src/db/models" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Wiki = require( "../../src/db/models" ).Wiki;
const Collaborator = require( "../../src/db/models" ).Collaborator;
const auth = require( "../support/mock-auth.js" );


describe( "routes:collaborators:wiki", () => {

  beforeAll( ( done ) => {
    auth.signOut( done );
  } );
  beforeEach( ( done ) => {
    this.user = {};
    this.wiki = {};
    this.collab = {};
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

            const values = {
              contentType: "wiki",
              contentId: this.wiki.id, // "Changing A Dirty Diaper"
              userId: this.user.collaborator.id, // "collaborator"
            };

            Collaborator.create( values )
            .then( ( collab ) => {
              expect( collab ).not.toBeNull();
              this.collab = collab;
              done();
            } );
          } );
        } );
      } );
    } )
    .catch( ( err ) => { console.log( "ERROR: %O", err ); done(); } );
  } );
  afterEach( ( done ) => {
    auth.signOut( done );
  } );

  describe( ":collaborator", () => {

    beforeEach( ( done ) => {
      const user = this.user.collaborator;
      auth.signIn( auth.user( user ), ( err, res, body ) => {
        expect( err ).toBeNull();
        done();
      } );
    } );

    describe( "GET /wikis/:id", () => {

      it( "should render a PRIVATE wiki " +
          "if the user is a collaborator", ( done ) => {

        const wiki = this.wiki; // "Changing A Dirty Diaper"
        const url = `${ base }/${ wiki.id }`;
        expect( wiki.creatorId ).not.toBe( this.user.id );
        expect( wiki.private ).toBe( true );

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( `${ wiki.title }</h1>` );
          //console.log( "BODY:", body );
          done();
        } );
      } );

    } );
    /* END: GET /wikis/:id ----- */

  } );
  /* END: routes:collaborators:wiki:collaborator ----- */

  describe( ":creator", () => {

    beforeEach( ( done ) => {
      const user = this.user.creator;
      auth.signIn( auth.user( user ), ( err, res, body ) => {
        expect( err ).toBeNull();
        done();
      } );
    } );

    describe( "GET /wikis/:wikiId/collaborators", () => {

      it( "should render the Collaborators page " +
          "AND display collaborators for the requested wiki", ( done ) => {

        const wiki = this.wiki; // "Changing A Dirty Diaper"
        const url = `${ base }/${ wiki.id }/collaborators`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "Blocipedia | Wiki Collaborators" );
          expect( body ).toContain( this.user.creator.username );
          expect( body ).toContain( this.user.creator.email );
          expect( body ).toContain( this.user.collaborator.username );
          expect( body ).toContain( this.user.collaborator.email );
          //console.log( "BODY:", body );
          done();
        } );
      } );

    } );
    /* END: GET /wikis/:wikiId/collaborators ----- */

    describe( "POST /wikis/:wikiId/collaborators/create", () => {

      beforeEach( ( done ) => {

        const values = {
          username: "other",
          email: "other@example.com",
          password: "1234567890",
          role: "standard",
        };

        User.create( values )
        .then( ( user ) => {
          expect( user ).not.toBeNull();
          this.user.other = user;
          done();
        } );
      } );

      it( "should add a new Collaborator " +
          "with the specified content and user data", ( done ) => {

        const wiki = this.wiki; // "Changing A Dirty Diaper"
        const user = this.user.other; // "other"
        const where = {
          contentType: "wiki",
          contentId: wiki.id,
          userId: user.id
        };

        const url = `${ base }/${ wiki.id }/collaborators/create`;
        const form = { email: user.email };
        const options = { url, form };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );
          console.log( "BODY: %O", body );

          Collaborator.findOne( { where } )
          .then( ( collab ) => {
            expect( collab ).not.toBeNull();
            done();
          } );
        } );
      } );

      it( "should NOT add a duplicate Collaborator " +
          "with the same content and user data", ( done ) => {

        const wiki = this.wiki; // "Changing A Dirty Diaper"
        const user = this.user.collaborator; // "collaborator"
        const where = {
          contentType: "wiki",
          contentId: wiki.id,
          userId: user.id
        };

        Collaborator.count( { where } )
        .then( ( countBefore ) => {
          expect( countBefore ).toBe( 1 ); // exists

          const url = `${ base }/${ wiki.id }/collaborators/create`;
          const form = { email: user.email };
          const options = { url, form };

          request.post( options, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 302 );
            console.log( "BODY: %O", body );

            Collaborator.count( { where } )
            .then( ( countAfter ) => {
              expect( countAfter ).toBe( countBefore ); // unchanged
              done();
            } );
          } );
        } );
      } );

    } );
    /* END: POST /wikis/:wikiId/collaborators/create ----- */

    describe( "GET /wikis/:wikiId/collaborators/:userId/delete", () => {

      it( "should remove the Collaborator " +
          "with the specified content and user data", ( done ) => {

        const wiki = this.wiki; // "Changing A Dirty Diaper"
        const user = this.user.collaborator; // "collaborator"
        const where = {
          contentType: "wiki",
          contentId: wiki.id,
          userId: user.id
        };

        const url = `${ base }/${ wiki.id }/collaborators/${ user.id }/delete`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          //console.log( "BODY:", body );

          Collaborator.count( { where } )
          .then( ( countAfter ) => {
            expect( countAfter ).toBe( 0 ); // removed
            done();
          } );
        } );
      } );

    } );
    /* END: GET /wikis/:wikiId/collaborators/:userId/delete ----- */

  } );
  /* END: routes:collaborators:wiki:creator ----- */

} );
/* END: routes:collaborators:wiki ----- */
