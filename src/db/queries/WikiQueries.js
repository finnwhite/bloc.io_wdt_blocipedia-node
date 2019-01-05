const ModelQueries = require( "./ModelQueries.js" );

class WikiQueries extends ModelQueries {

  constructor( model ) {
    super( model );
  }

  makePublic( id, callback ) {

    const scope = { method: [ "byCreatorId", id ] };
    const records = this.model.scope( scope );
    const updates = { private: false };

    return (
      records.update( updates, { fields: Object.keys( updates ) } )
      .then( ( affected ) => { callback( null, affected ); } )
      .catch( ( err ) => { this.handleError( err, callback ) } )
    )
  }

};

module.exports = WikiQueries;
