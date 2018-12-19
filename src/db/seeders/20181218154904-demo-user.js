'use strict';
const faker = require( "faker" );

const table = "Users";
const count = 5;
const values = [];

const roles = [ "standard", "premium" ];

for ( let i = 0; i < count; i++ ) {
  values.push( {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: roles[ Math.floor( Math.random() * roles.length ) ],
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
