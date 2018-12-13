const Model = require( "./models" ).Model;

module.exports = {

  selectAll( callback ) {
    return (
      Model.findAll()
      .then( ( records ) => { callback( null, records ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  },

  select( id, callback ) {
    return (
      Model.findByPk( id )
      .then( ( record ) => { callback( null, record ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  },

  insert( values, callback ) {
    return (
      Model.create( values )
      .then( ( record ) => { callback( null, record ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  },

  update( id, updates, callback ) {
    return (
      Model.findByPk( id )
      .then( ( record ) => {
        if ( !record ) { return callback( 404 ); } // 404 Not Found

        record.update( updates, { fields: Object.keys( updates ) } )
        .then( ( record ) => { callback( null, record ); } )
        .catch( ( err ) => { callback( err ); } );
      } )
    )
  },

  delete( id, callback ) {
    return (
      Model.destroy( { where: { id } } )
      .then( ( destroyedCount ) => { callback( null, destroyedCount ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  },

};
