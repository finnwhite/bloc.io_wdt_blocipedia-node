'use strict';

const CollaboratorQueries = require( "../queries/CollaboratorQueries.js" );

module.exports = ( sequelize, DataTypes ) => {

  const Collaborator = sequelize.define( "Collaborator", {
    contentType: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      validate: { isIn: [ [ "wiki" ] ] },
    },
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: [ [ "default" ] ] },
      defaultValue: "default",
    },
  }, {
    defaultScope: {
      order: [ [ "createdAt", "ASC" ] ],
    },
    scopes: {
      wiki: {
        where: { contentType: "wiki" },
        order: [ [ "createdAt", "ASC" ] ],
      },
    },
  } );

  Collaborator.associate = function( models ) {

    Collaborator.belongsTo( models.User, {
      as: "collaborator",
      foreignKey: "userId",
    } );

    /* content models that support collaboration */
    Collaborator.contentModels = { wiki: models.Wiki }

  };

  Collaborator.queries = new CollaboratorQueries( Collaborator );

  Collaborator.getContentModel = function( type ) {
    return Collaborator.contentModels[ type ];
  };

  Collaborator.prototype.getContent = function() {
    const model = Collaborator.getContentModel( this.contentType );
    if ( model ) { return model.findByPk( this.contentId ); }
  };

  return Collaborator;
};
