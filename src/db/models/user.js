'use strict';

const UserQueries = require( "../queries/UserQueries.js" );
const crypt = require( "../../util/encryption.js" );

module.exports = ( sequelize, DataTypes ) => {

  const User = sequelize.define( "User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { len: [ 2 ] },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [ 4 ] },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "guest",
    },
  }, {} );

  User.associate = function( models ) {
    // associations can be defined here
  };

  User.queries = new UserQueries( User );

  User.encryptPassword = function( password ) {
    return crypt.encrypt( password );
  };

  User.matchPassword = function( password, encrypted ) {
    return crypt.match( password, encrypted );
  };

  User.prototype.matchPassword = function( password ) {
    return User.matchPassword( password, this.password );
  };

  return User;
};
