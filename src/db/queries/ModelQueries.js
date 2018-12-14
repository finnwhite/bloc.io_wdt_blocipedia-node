class ModelQueries {

  constructor( model ) {
    this.model = model;
  }

  selectAll( callback ) {
    return (
      this.model.findAll()
      .then( ( records ) => { callback( null, records ); } )
      .catch( ( err ) => { this.handleError( err, callback ) } )
    )
  }

  select( id, callback ) {
    return (
      this.model.findByPk( id )
      .then( ( record ) => { callback( null, record ); } )
      .catch( ( err ) => { this.handleError( err, callback ) } )
    )
  }

  insert( values, callback ) {
    return (
      this.model.create( values )
      .then( ( record ) => { callback( null, record ); } )
      .catch( ( err ) => { this.handleError( err, callback ) } )
    )
  }

  update( id, updates, callback ) {
    return (
      this.model.findByPk( id )
      .then( ( record ) => {
        if ( !record ) { return callback( "404 Not Found" ); }

        record.update( updates, { fields: Object.keys( updates ) } )
        .then( ( record ) => { callback( null, record ); } )
        .catch( ( err ) => { this.handleError( err, callback ) } )
      } )
    )
  }

  delete( id, callback ) {
    return (
      this.model.destroy( { where: { id } } )
      .then( ( destroyedCount ) => { callback( null, destroyedCount ); } )
      .catch( ( err ) => { this.handleError( err, callback ) } )
    )
  }

  handleError( err, callback ) {
    /* format error messages */
    const sq = err.errors[ 0 ].message; // Sequelize error message
    const db = err.original.detail; // database error message
    const msg = `${ db } ${ sq }`;
    return callback( msg );
  }

};

module.exports = ModelQueries;
