const server = require( "../../src/server.js" );
const request = require( "request" );
const base = "http://localhost:3000/users";

const sequelize = require( "../../src/db/models" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Wiki = require( "../../src/db/models" ).Wiki;
const Collaborator = require( "../../src/db/models" ).Collaborator;
const auth = require( "../support/mock-auth.js" );


describe( "routes:users", () => {

  beforeAll( ( done ) => {
    auth.signOut( done );
  } );
  beforeEach( ( done ) => {
    this.user = {};
    this.wiki = {};
    this.collab = {};
    sequelize.sync( { force: true } ).then( () => { done(); } )
    .catch( ( err ) => { console.log( "ERROR: %O", err ); done(); } );
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
          //console.log( "BODY:", body );
          done();
        } );
      } );

    } );
    /* END: GET /users/sign-up ----- */

    describe( "POST /users/create", () => {

      it( "should create a new User " +
          "when supplied valid values", ( done ) => {

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
          console.log( "BODY: %O", body );

          User.findOne( { where: { username: form.username } } )
          .then( ( user ) => {
            expect( user ).not.toBeNull();

            const encrypted = user.matchPassword( form.password );
            expect( user.username ).toBe( form.username );
            expect( user.email ).toBe( form.email );
            expect( user.password ).not.toBe( form.password );
            expect( encrypted ).toBe( true ); // password ENCRYPTED!
            expect( user.role ).toBe( "standard" ); // default role/plan
            done();
          } );
        } );
      } );

      it( "should NOT create a new User " +
          "when supplied INVALID values", ( done ) => {

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
          console.log( "BODY: %O", body );

          User.findOne( { where: { username: form.username } } )
          .then( ( user ) => {
            expect( user ).toBeNull();
            done();
          } );
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

          User.count( { where: { username: "popular" } } )
          .then( ( countBefore ) => {
            expect( countBefore ).toBe( 1 );

            const url = `${ base }/create`;
            const form = {
              username: "popular",
              email: "popular@example.com",
              password: "copycat",
              confirmation: "copycat",
            };
            const options = { url, form };

            request.post( options, ( err, res, body ) => {
              expect( err ).toBeNull();
              expect( res.statusCode ).toBe( 302 );
              console.log( "BODY: %O", body );

              User.count( { where: { username: "popular" } } )
              .then( ( countAfter ) => {
                expect( countAfter ).toBe( countBefore ); // unchanged
                done();
              } );
            } );
          } );
        } );
      } );

    } );
    /* END: POST /users/create ----- */

    describe( "GET /users/sign-in", () => {

      it( "should render the Sign In page", ( done ) => {

        const url = `${ base }/sign-in`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "Blocipedia | Sign In" );
          //console.log( "BODY:", body );
          done();
        } );
      } );

    } );
    /* END: GET /users/sign-in ----- */

  } );
  /* END: routes:users:guest ----- */

  describe( ":standard", () => {

    beforeEach( ( done ) => {

      const values = {
        username: "std-user",
        email: "std@example.com",
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

    describe( "GET /users/account", () => {

      it( "should render the Account page displaying the current user's " +
          "username, email, and membership plan", ( done ) => {

        const url = `${ base }/account`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "Blocipedia | Account" );
          expect( body ).toContain( this.user.username ); // "std-user"
          expect( body ).toContain( this.user.email ); // "std@example.com"
          expect( body ).toContain( this.user.role ); // "standard"
          //console.log( "BODY:", body );
          done();
        } );
      } );

    } );
    /* END: GET /users/account ----- */

    describe( "POST /users/upgrade-plan", () => {

      it( "should upgrade current user to premium plan", ( done ) => {

        const url = `${ base }/upgrade-plan`;
        const form = {
          plan: "premium",
          stripeToken: "tok_visa", // stripe test token
          stripeEmail: this.user.email,
        };
        const options = { url, form };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );
          console.log( "BODY: %O", body );

          this.user.reload()
          .then( ( user ) => {
            expect( user.role ).not.toBe( "standard" );
            expect( user.role ).toBe( "premium" ); // upgraded
            done();
          } );
        } );
      } );

    } );
    /* END: POST /users/upgrade-plan ----- */

    describe( "GET /users/dashboard", () => {

      beforeEach( ( done ) => {

        const values = {
          title: "Getting A Toddler To Wear A Bib",
          body: "So much yogurt. So much laundry.",
          creatorId: this.user.id,
        };

        Wiki.create( values )
        .then( ( wiki ) => {
          expect( wiki ).not.toBeNull();
          this.wiki.myWiki = wiki;

          const values = {
            username: "creator",
            email: "creator@example.com",
            password: "1234567890",
            role: "premium",
          };

          User.create( values )
          .then( ( user ) => {
            expect( user ).not.toBeNull();

            const values = {
              title: "Changing A Dirty Diaper",
              body: "What is THAT? Photos plus detailed descriptions.",
              private: true,
              creatorId: user.id,
            };

            Wiki.create( values )
            .then( ( wiki ) => {
              expect( wiki ).not.toBeNull();
              this.wiki.myCollab = wiki;

              const values = {
                contentType: "wiki",
                contentId: wiki.id, // "Changing A Dirty Diaper"
                userId: this.user.id, // "std-user"
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
      } );

      it( "should render the current user's Dashboard page " +
          "AND display wikis created by the user " +
          "AND the user's wiki collaborations", ( done ) => {

        const url = `${ base }/dashboard`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );

          const wiki = this.wiki;
          expect( body ).toContain( "Blocipedia | Dashboard" );
          expect( body ).toContain( "My Wikis</h1>" );
          expect( body ).toContain( wiki.myWiki.title ); // "...To Wear A Bib"
          expect( body ).toContain( "My Collaborations</h1>" );
          expect( body ).toContain( wiki.myCollab.title ); // "...Dirty Diaper"
          //console.log( "BODY:", body );
          done();
        } );
      } );

    } );
    /* END: GET /wikis/dashboard ----- */

  } );
  /* END: routes:users:standard ----- */

  describe( ":premium", () => {

    beforeEach( ( done ) => {

      const values = {
        username: "prm-user",
        email: "prm@example.com",
        password: "1234567890",
        role: "premium",
      };

      User.create( values )
      .then( ( user ) => {
        expect( user.role ).toBe( "premium" );
        this.user = user;
        this.wiki.byUser = {};

        const values = {
          title: "Getting A Toddler To Wear A Bib",
          body: "So much yogurt. So much laundry.",
          creatorId: user.id,
        };

        Wiki.create( values )
        .then( ( wiki ) => {
          expect( wiki.private ).toBe( false ); // default value
          this.wiki.byUser.public = wiki;

          const values = {
            title: "Frustrating Toddlers",
            body: "Take a deep breath and count to ten.",
            private: true,
            creatorId: user.id,
          };

          Wiki.create( values )
          .then( ( wiki ) => {
            expect( wiki.private ).toBe( true );
            this.wiki.byUser.private = wiki;

            auth.signIn( auth.user( user ), ( err, res, body ) => {
              expect( err ).toBeNull();
              done();
            } );
          } );
        } );
      } );
    } );

    describe( "POST /users/downgrade-plan", () => {

      it( "should downgrade current user to standard plan " +
          "AND make PUBLIC all PRIVATE wikis created by user", ( done ) => {

        const wikis = Wiki.scope( [
          "private", { method: [ "byCreatorId", this.user.id ] }
        ] );

        wikis.count()
        .then( ( countBefore ) => {
          expect( countBefore ).toBeGreaterThan( 0 );

          const url = `${ base }/downgrade-plan`;
          const form = { plan: "standard" };
          const options = { url, form };

          request.post( options, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 302 );
            console.log( "BODY: %O", body );

            this.user.reload()
            .then( ( user ) => {
              expect( user.role ).not.toBe( "premium" );
              expect( user.role ).toBe( "standard" ); // downgraded

              wikis.count()
              .then( ( countAfter ) => {
                expect( countAfter ).toBe( 0 ); // private wikis made public
                done();
              } );
            } );
          } );
        } );
      } );

    } );
    /* END: POST /users/downgrade-plan ----- */

  } );
  /* END: routes:users:premium ----- */

} );
/* END: routes:users ----- */
