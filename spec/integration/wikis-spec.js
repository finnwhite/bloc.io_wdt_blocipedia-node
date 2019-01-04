const server = require( "../../src/server.js" );
const request = require( "request" );
const base = "http://localhost:3000/wikis";

const sequelize = require( "../../src/db/models" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Wiki = require( "../../src/db/models" ).Wiki;
const auth = require( "../support/mock-auth.js" );


describe( "routes:wikis", () => {

  beforeAll( ( done ) => {
    auth.signOut( done );
  } );
  beforeEach( ( done ) => {
    this.user;
    this.wiki = {};
    sequelize.sync( { force: true } ).then( () => {

      const values = {
        username: "other",
        email: "other@example.com",
        password: "1234567890",
        role: "premium",
      };

      User.create( values )
      .then( ( user ) => {
        expect( user ).not.toBeNull();
        this.user = user;

        const values = {
          title: "Putting A Toddler To Bed",
          body: "Clear your schedule, this could take a while.",
          creatorId: user.id,
        };

        Wiki.create( values )
        .then( ( wiki ) => {
          expect( wiki.private ).toBe( false ); // default value
          this.wiki.public = wiki;

          const values = {
            title: "Changing A Dirty Diaper",
            body: "What is THAT? Photos plus detailed descriptions.",
            private: true,
            creatorId: user.id,
          };

          Wiki.create( values )
          .then( ( wiki ) => {
            expect( wiki.private ).toBe( true );
            this.wiki.private = wiki;
            done();
          } );
        } );
      } );
    } )
    .catch( ( err ) => { console.log( err ); done(); } );
  } );
  afterEach( ( done ) => {
    auth.signOut( done );
  } );

  describe( ":guest", () => {

    describe( "GET /wikis", () => {

      it( "should render the Wikis page " +
          "AND display PUBLIC wikis only", ( done ) => {

        const url = base;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );

          const wiki = this.wiki;
          expect( body ).toContain( "Blocipedia | Wikis" );
          expect( body ).toContain( wiki.public.title ); // "...To Bed"
          expect( body ).not.toContain( wiki.private.title ); // "...Diaper"
          done();
        } );
      } );

    } );
    /* END: GET /wikis ----- */

  } );
  /* END: routes:wikis:guest ----- */

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

        const values = {
          title: "Getting A Toddler To Wear A Bib",
          body: "So much yogurt. So much laundry.",
          creatorId: user.id,
        };

        Wiki.create( values )
        .then( ( wiki ) => {
          expect( wiki.private ).toBe( false ); // default value
          this.wiki.byUser = wiki;

          auth.signIn( auth.user( user ), ( err, res, body ) => {
            expect( err ).toBeNull();
            done();
          } );
        } );
      } );
    } );

    describe( "GET /wikis/new", () => {

      it( "should render the New Wiki page", ( done ) => {

        const url = `${ base }/new`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "Blocipedia | New Wiki" );
          done();
        } );
      } );

    } );
    /* END: GET /users/sign-in ----- */

    describe( "POST /wikis/create", () => {

      it( "should create a new public wiki " +
          "when supplied valid values", ( done ) => {

        const url = `${ base }/create`;
        const form = {
          title: "Toddler Tunes",
          body: "Head, shoulders, knees and toes, knees and toes.",
          private: "0",
        };
        const options = { url, form };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          Wiki.findOne( { where: { title: form.title } } )
          .then( ( wiki ) => {
            expect( wiki ).not.toBeNull();

            expect( wiki.title ).toBe( form.title );
            expect( wiki.body ).toBe( form.body );
            expect( wiki.private ).toBe( false ); // default value
            expect( wiki.creatorId ).toBe( this.user.id );
            done();
          } );
        } );
      } );

      it( "should NOT create new wiki " +
          "when supplied INVALID values", ( done ) => {

        const url = `${ base }/create`;
        const form = {
          title: "Z",
          body: "Zzz",
          private: "0",
        };
        const options = { url, form };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          Wiki.findOne( { where: { title: form.title } } )
          .then( ( wiki ) => {
            expect( wiki ).toBeNull();
            done();
          } );
        } );
      } );

    } );
    /* END: POST /wikis/create ----- */

    describe( "GET /wikis/:id", () => {

      it( "should render the requested public wiki", ( done ) => {

        const wiki = this.wiki.public; // "Putting A Toddler To Bed"
        const url = `${ base }/${ wiki.id }`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( `Wikis | ${ wiki.title }` );
          done();
        } );
      } );

      it( "should NOT render the requested PRIVATE wiki", ( done ) => {

        const wiki = this.wiki.private; // "Changing A Dirty Diaper"
        const url = `${ base }/${ wiki.id }`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).not.toContain( `Wikis | ${ wiki.title }` );
          done();
        } );
      } );

    } );
    /* END: GET /wikis/:id ----- */

    describe( "GET /wikis/:id/edit", () => {

      it( "should render a form to edit the requested public wiki", ( done ) => {

        const wiki = this.wiki.public; // "Putting A Toddler To Bed"
        const url = `${ base }/${ wiki.id }/edit`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "Blocipedia | Edit Wiki" );
          done();
        } );
      } );

    } );
    /* END: GET /wikis/:id/edit ----- */

    describe( "POST /wikis/:id/update", () => {

      it( "should update a public wiki with the given values", ( done ) => {

        const wiki = this.wiki.public; // "Putting A Toddler To Bed"
        const before = { ...wiki.get() };
        const url = `${ base }/${ wiki.id }/update`;
        const form = {
          title: "Putting A Cranky Toddler To Bed",
          body: "Clear your schedule, this is gonna take a while.",
          private: "0",
        };
        const options = { url, form };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          Wiki.findOne( { where: { title: form.title } } )
          .then( ( wiki ) => {
            expect( wiki ).not.toBeNull();

            expect( wiki.id ).toBe( before.id ); // unchanged
            expect( wiki.title ).not.toBe( before.title );
            expect( wiki.title ).toBe( form.title ); // updated
            expect( wiki.body ).not.toBe( before.body );
            expect( wiki.body ).toBe( form.body ); // updated
            expect( wiki.creatorId ).toBe( before.creatorId ); // unchanged
            done();
          } );
        } );
      } );

    } );
    /* END: GET /wikis/:id/update ----- */

    describe( "GET /wikis/:id/delete", () => {

      it( "should delete a wiki created by the user", ( done ) => {

        Wiki.findAll()
        .then( ( wikis ) => {
          const countBefore = wikis.length;
          expect( countBefore ).toBeGreaterThan( 0 );

          const wiki = this.wiki.byUser; // "Getting A Toddler To Wear A Bib"
          const url = `${ base }/${ wiki.id }/delete`;
          expect( wiki.creatorId ).toBe( this.user.id );

          request.get( url, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 200 );

            Wiki.findAll()
            .then( ( wikis ) => {
              expect( wikis.length ).toBe( countBefore - 1 );
              done();
            } );
          } );
        } );
      } );

    } );
    /* END ----- GET /wikis/:id/delete ----- */

  } );
  /* END: routes:wikis:standard ----- */

} );
/* END: routes:wikis ----- */
