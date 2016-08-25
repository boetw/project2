'use strict';
module.exports = function(sequelize, DataTypes) {
  var userset = sequelize.define('userset', {
    userid: DataTypes.INTEGER,
    setid: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return userset;
};