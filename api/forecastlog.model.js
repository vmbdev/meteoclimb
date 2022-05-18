/**
 * @module model/forecastlog
 * @requires model/city
 */
import { Sequelize, DataTypes } from 'sequelize';
import City from './city.model.js';

/**
 * Represents the last time the forecast of a city was updated
 * @class
 * @extends Sequelize.model
 */
class ForecastLog extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        cityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize
      }
    );

    this.belongsTo(City, {
      foreignKey: { unique: true },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

export default ForecastLog;