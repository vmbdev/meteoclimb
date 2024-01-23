import { Sequelize, DataTypes, Model } from 'sequelize';

/**
 * Model for the City object representing a location with a weather station.
 * @class
 * @extends Sequelize.Model
 */
class City extends Model {
  /**
   * Initialises the model with the database connection.
   * @param {Sequelize} - Sequelize object with initiated database.
   */
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        flatName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        state: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        country: {
          type: DataTypes.STRING(2),
          allowNull: false,
        },
        lon: {
          type: DataTypes.DECIMAL(9, 6),
          allowNull: false,
        },
        lat: {
          type: DataTypes.DECIMAL(8, 6),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'City',
      }
    );
  }

  /**
   *
   * @param {string} locationName - The name of the location with the format
   *    City,Country, i.e. Paris,FR.
   * @param {number} limit - The maximum amount of cities that will be returned
   *    from the search.
   * @returns {Array} An array containing the cities found.
   */
  static async findByName(locationName, limit = 10) {
    // locationName expects "City" or "City,Country"
    const [cityName, cityCountry] = locationName
      .split(',')
      .map((i) => i.trim());
    const where = {};

    // database contains a "flat" name of the city without accents and so
    // this is the column we use to make the search
    const normalizedName = cityName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();

    where.flatName = {
      [Sequelize.Op.like]: normalizedName + '%',
    };

    if (cityCountry) where.country = cityCountry.toUpperCase();

    const params = {
      attributes: ['id', 'lon', 'lat', 'name', 'country'],
      where,
      order: [['name', 'ASC']],
      limit: limit,
    };

    return this.findAll(params);
  }
}

export default City;
