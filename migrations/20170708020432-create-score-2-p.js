'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Score_2Ps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      player1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      player2: {
        allowNull: false,
        type: Sequelize.STRING
      },
      player1_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: '0'
      },
      player2_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: '0'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Score_2Ps');
  }
};
