const sequelize = require( "./models/index.js" ).sequelize;

sequelize.authenticate()
.then( () => {
  console.log( "Connection has been established successfully." );
  sequelize.close();
} )
.catch( ( err ) => {
  console.error( "Unable to connect to the database:", err );
  sequelize.close();
} );
