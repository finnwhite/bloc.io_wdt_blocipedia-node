const ModelQueries = require( "./ModelQueries.js" );

class UserQueries extends ModelQueries {

  constructor( model ) {
    super( model );
  }

  dashboard( id, callback ) {
    return (
      this.model.scope( "dashboard" ).findByPk( id )
      .then( ( record ) => { callback( null, record ); } )
      .catch( ( err ) => { this.handleError( err, callback ) } )
    )
  }

};

module.exports = UserQueries;
