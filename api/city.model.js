/**
 * @module model/city
 */
import { Sequelize, DataTypes } from 'sequelize';

/**
 * Represents a City from the database.
 * @class
 * @extends Sequelize.Model
 */
class City extends Sequelize.Model {
  /**
   * Initialises the model with the database connection.
   * @param {Sequelize} - Sequelize object with initiated database.
   */
  static init(sequelize) {
    super.init({
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      flatName: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      state: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING(2),
        allowNull: false
      },
      lon: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false
      },
      lat: {
        type: DataTypes.DECIMAL(8, 6),
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'cities'
    });
  }

  /**
   * 
   * @param {string} locationName - The name of the location: City,Country, i.e. Paris,FR.
   * @param {number} limit - The maximum amount of cities that will be returned from the search.
   * @returns {Array} An array containing the cities found.
   */
  static async findByName(locationName, limit = 10) {
    // locationName expects "City" or "City,Country"
    const [cityName, cityCountry] = locationName.split(',').map(i => i.trim());
    const whereCondition = {};

    whereCondition.flatName = {
      [Sequelize.Op.like]: Sequelize.fn('unaccent', cityName.toLowerCase() + '%')
    };

    if (cityCountry) whereCondition.country = cityCountry.toUpperCase();

    const params = {
      attributes: ['id', 'lon', 'lat', 'name', 'country'],
      where: whereCondition,
      order: [['name', 'ASC']],
      limit: limit
    };

    return this.findAll(params);
  }
}

export default City;