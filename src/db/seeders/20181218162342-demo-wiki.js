'use strict';
const faker = require( "faker" );

const table = "Wikis";
const count = 12;
const values = [];

const paras = { min: 2, max: 5 };
const userCount = 5;

function randomInt( min, max ) {
  return ( min + Math.floor( Math.random() * ( max - min + 1 ) ) )
}

for ( let i = 0; i < count; i++ ) {
  values.push( {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs( randomInt( paras.min, paras.max ), "\n\n" ),
    private: faker.random.boolean(),
    creatorId: randomInt( 1, userCount ),
    createdAt: new Date(),
    updatedAt: new Date(),
  } );
}

module.exports = {
  up: ( queryInterface, Sequelize ) => {
    return queryInterface.bulkInsert( table, values );
  },
  down: ( queryInterface, Sequelize ) => {
    return queryInterface.bulkDelete( table );
  }
};
