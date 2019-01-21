'use strict';

const table = "Collaborators";
const values = [];

const userCount = 5;
const wikiCount = 12;

function randomInt( min, max ) {
  return ( min + Math.floor( Math.random() * ( max - min + 1 ) ) )
}

for ( let i = 0; i < wikiCount; i++ ) {
  for ( let j = 0; j < userCount; j++ ) {
    if ( !randomInt( 0, 3 ) ) {
      values.push( {
        contentType: "wiki",
        contentId: ( i + 1 ),
        userId: ( j + 1 ),
        createdAt: new Date(),
        updatedAt: new Date(),
      } );
    }
  }
}

module.exports = {
  up: ( queryInterface, Sequelize ) => {
    return queryInterface.bulkInsert( table, values );
  },
  down: ( queryInterface, Sequelize ) => {
    return queryInterface.bulkDelete( table );
  }
};
