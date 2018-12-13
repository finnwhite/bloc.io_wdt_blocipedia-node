const sequelize = require( "../../src/db/models" ).sequelize;


describe( "Model", () => {

  beforeEach( ( done ) => {
    sequelize.sync( { force: true } )
    .then( () => { done(); } )
    .catch( ( err ) => {
      console.log( err );
      done();
    } );
  } );

} );
/* END: Model ----- */
