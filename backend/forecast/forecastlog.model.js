import { Sequelize, DataTypes } from 'sequelize';
import City from '../city/city.model.js';

/**
 * Represents the last time the forecast of a city was updated
 * @class
 * @extends Sequelize.model
 */
class ForecastLog extends Sequelize.Model {
  /**
   * Initialises the model with the database connection.
   * @param {Sequelize} - Sequelize object with initiated database.
   */
  static init(sequelize) {
    super.init(
      {
        cityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'ForecastLog',
      }
    );

    this.belongsTo(City, {
      foreignKey: {
        name: 'cityId',
        unique: true,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

export default ForecastLog;
