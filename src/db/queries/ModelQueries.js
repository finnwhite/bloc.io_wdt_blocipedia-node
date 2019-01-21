class ModelQueries {

  constructor( model ) {
    this.model = model;
  }

  scope( scope = null ) {
    return new this.constructor( this.model.scope( scope ) );
  }

  selectAll( callback ) {
    return (
      this.model.findAll()
      .then( ( records ) => { callback( null, records ); } )
      .catch( ( err ) => { this.handleError( err, callback ) } )
    )
  }
  selectAllWhere( where, callback ) {
    return (
      this.model.findAll( { where } )
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
  selectWhere( where, callback ) {
    return (
      this.model.findOne( { where } )
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
  deleteWhere( where, callback ) {
    return (
      this.model.destroy( { where } )
      .then( ( destroyedCount ) => { callback( null, destroyedCount ); } )
      .catch( ( err ) => { this.handleError( err, callback ) } )
    )
  }

  handleError( err, callback ) {
    //console.log( "QUERY ERROR: %O", err );

    /* format error messages */
    const es = err.toString();
    const em = err.message;
    const db = err.original.detail; // database error message
    const sq = err.errors[ 0 ].message; // Sequelize error message
    const msg = `${ db } ${ sq }`;

    console.log( "err.toString(): %O", es );
    console.log( "err.message: %O", em );
    console.log( "err.db: %O", db );
    console.log( "err.sq: %O", sq );
    console.log( "msg: %O", msg );

    return callback( msg );
  }

};

module.exports = ModelQueries;
