'use strict';
module.exports = function(sequelize, DataTypes) {
  var wishlist = sequelize.define('wishlist', {
    userid: DataTypes.INTEGER,
    setid: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return wishlist;
};