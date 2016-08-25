'use strict';
module.exports = function(sequelize, DataTypes) {
  var set = sequelize.define('set', {
    setnum: DataTypes.STRING,
    setname: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.set.belongsToMany(models.user, {
          through: "userset"
        })
      }
    }
  });
  return set;
};