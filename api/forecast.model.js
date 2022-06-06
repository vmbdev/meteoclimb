/**
 * @module model/forecast
 * @requires model/city
 */
import { Sequelize, DataTypes } from 'sequelize';
import City from './city.model.js';

/**
 * Represents the forecast in the database
 * @class
 * @extends Sequelize.Model
 */
class Forecast extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        conditions: {
          type: DataTypes.JSON,
          allowNull: false
        },
        cityId: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      },
      {
        sequelize,
        timestamps: false,
        modelName: 'forecasts'
      }
    );

    this.belongsTo(City, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}

export default Forecast;