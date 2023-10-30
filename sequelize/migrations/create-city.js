'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      flatName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING(2),
        allowNull: false
      },
      lon: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false
      },
      lat: {
        type: Sequelize.DECIMAL(8, 6),
        allowNull: false
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cities');
  }
};