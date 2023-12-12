'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ForecastLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addColumn('ForecastLogs', 'cityId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Cities', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ForecastLogs');
  },
};
