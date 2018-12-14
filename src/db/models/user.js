'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
