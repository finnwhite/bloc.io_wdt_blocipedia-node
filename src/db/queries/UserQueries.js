const ModelQueries = require( "./ModelQueries.js" );
const User = require( "../models" ).User;

class UserQueries extends ModelQueries {

  constructor() {
    super( User );
  }

};

module.exports = UserQueries;
