'use strict';

const WikiQueries = require( "../queries/WikiQueries.js" );
const text = require( "../../util/text.js" );
const markdown = require( "markdown" ).markdown;

module.exports = ( sequelize, DataTypes ) => {

  const Wiki = sequelize.define( "Wiki", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [ 2 ] },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { len: [ 4 ] },
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
  }, {
    /* defaultScope defined in Wiki.associate */

    scopes: {
      public: {
        where: { private: false },
        order: [ [ "updatedAt", "DESC" ] ],
      },
      private: {
        where: { private: true },
        order: [ [ "updatedAt", "DESC" ] ],
      },
      byCreatorId: function( id ) {
        return {
          where: { creatorId: id },
          order: [ [ "updatedAt", "DESC" ] ],
        };
      },
    },
  } );

  Wiki.associate = function( models ) {

    Wiki.belongsTo( models.User, { as: "creator" } );

    Wiki.hasMany( models.Collaborator, {
      as: "collaboration",
      scope: { contentType: "wiki" },
      foreignKey: "contentId",
    } );

    Wiki.belongsToMany( models.User, {
      as: "collaborators",
      through: {
        model: models.Collaborator,
        scope: { contentType: "wiki" },
        unique: false,
      },
      foreignKey: "contentId",
      constraints: false,
    } );

    Wiki.addScope( "defaultScope",  {
      include: [ {
        association: "creator",
      }, {
        association: "collaboration",
        include: [ {
          association: "collaborator"
        } ],
        order: [ [ models.Collaborator, "createdAt", "ASC" ] ],
      } ],
      order: [ [ "updatedAt", "DESC" ] ],
    }, { override: true } );

  };

  Wiki.queries = new WikiQueries( Wiki );

  Wiki.prototype.getBodyHtml = function() {
    return markdown.toHTML( this.body );
  };
  Wiki.prototype.getBodyPreview = function() {
    return text.getLineByNum( this.body, 1 );
  };
  Wiki.prototype.getPrivacy = function() {
    return this.private ? "private" : "public";
  };

  return Wiki;
};
