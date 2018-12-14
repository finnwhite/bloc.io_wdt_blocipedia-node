module.exports = {

  init( app ) {

    app.use( require( "../routes/root.js" ) );
    app.use( require( "../routes/users.js" ) );

  },

};
