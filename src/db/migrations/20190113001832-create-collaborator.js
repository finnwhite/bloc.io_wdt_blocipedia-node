'use strict';

module.exports = {

  up: ( queryInterface, Sequelize ) => {
    return queryInterface.createTable( "Collaborators", {

      contentType: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      contentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "default",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    } );
  },

  down: ( queryInterface, Sequelize ) => {
    return queryInterface.dropTable( "Collaborators" );
  }
};
