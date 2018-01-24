'use strict';
module.exports = function(sequelize, DataTypes) {
  var Score_2P = sequelize.define('Score_2P', {
    player1: DataTypes.STRING,
    player2: DataTypes.STRING,
    player1_score: DataTypes.INTEGER,
    player2_score: DataTypes.INTEGER
  });
  return Score_2P;
};
