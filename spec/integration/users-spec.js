const server = require( "../../src/server.js" );
const request = require( "request" );
const base = "http://localhost:3000/users";

const sequelize = require( "../../src/db/models" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Wiki = require( "../../src/db/models" ).Wiki;
const auth = require( "../support/mock-auth.js" );


describe( "routes:users", () => {

  beforeAll( ( done ) => {
    auth.signOut( done );
  } );
  beforeEach( ( done ) => {
    this.user;
    this.wiki = {};
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
            expect( user.role ).toBe( "standard" ); // default role/plan
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

    describe( "GET /users/account", () => {

      it( "should render the Account page with the current user's " +
          "username, email, and membership plan", ( done ) => {

        const url = `${ base }/account`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "Blocipedia | Account" );
          expect( body ).toContain( this.user.username ); // "std-user"
          expect( body ).toContain( this.user.email ); // "std@example.com"
          expect( body ).toContain( this.user.role ); // "standard"
          done();
        } );
      } );

    } );
    /* END: GET /users/account ----- */

    describe( "POST /users/upgrade-plan", () => {

      it( "should upgrade current user to premium plan " +
          "when supplied valid values", ( done ) => {

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

        const scope = [
          "private", { method: [ "byCreatorId", this.user.id ] }
        ];
        const wikis = Wiki.scope( scope );
        wikis.count()
        .then( ( countBefore ) => {
          expect( countBefore ).toBeGreaterThan( 0 );

          const url = `${ base }/downgrade-plan`;
          const form = { plan: "standard" };
          const options = { url, form };

          request.post( options, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 302 );

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
