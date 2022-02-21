import { Sequelize, DataTypes } from 'sequelize';
import City from './city.js';
import WeatherProvider from './weatherprovider.js';

export default class Forecast extends Sequelize.Model {
  static init(sequelize, wprovider) {
    super.init({
      day1: {
        type: DataTypes.JSON,
        allowNull: false
      },
      day2: {
        type: DataTypes.JSON,
        allowNull: false
      },
      day3: {
        type: DataTypes.JSON,
        allowNull: false
      },
      day4: {
        type: DataTypes.JSON,
        allowNull: false
      },
      day5: {
        type: DataTypes.JSON,
        allowNull: false
      },
      day6: {
        type: DataTypes.JSON,
        allowNull: false
      },
      day7: {
        type: DataTypes.JSON,
        allowNull: false
      },

    }, {
      sequelize,
      modelName: 'forecast'
    });

    if (wprovider instanceof WeatherProvider)
      this.wprovider = wprovider;
    else
      throw 'Provider not valid';

    this.hasOne(City, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }

  static async getWeatherByName(name) {
    return City.findName(name, 1)
      .then(res => { return this.wprovider.getWeatherData(res.lon, res.lat) })
      .then(res => { return res.body });
  }

  static async getWeatherById(id) {
    return City.findCoordinatesById(id)
      .then(res => { return this.wprovider.getWeatherData(res.lon, res.lat) })
      .then(res => { return res.body });
  }
}
