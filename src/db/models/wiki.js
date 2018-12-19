'use strict';

const WikiQueries = require( "../queries/WikiQueries.js" );

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
  }, {
    scopes: {
      public: { where: { private: false } },
    },
  } );

  Wiki.associate = function( models ) {

    Wiki.belongsTo( models.User, { as: "creator" } );

  };

  Wiki.queries = new WikiQueries( Wiki );

  return Wiki;
};
