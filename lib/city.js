import { Sequelize, DataTypes } from 'sequelize';
import WeatherProvider from './weatherprovider.js';

export default class City extends Sequelize.Model {
  static init(sequelize, wprovider) {
    super.init({
      name: {
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
        type: DataTypes.DECIMAL(9,6),
        allowNull: false
      },
      lat: {
        type: DataTypes.DECIMAL(8,6),
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'cities'
    });

    if (wprovider instanceof WeatherProvider)
      this.wprovider = wprovider;
    else
      throw 'Provider not valid';
  }

  static async findName(name, limit = 10) {
    var carr = name.split(',');
    var where = {};

    where.name = { [Sequelize.Op.iLike]: carr[0] + '%' };

    if (carr.length > 1)
      where.country = { [Sequelize.Op.iLike]: carr[1] };

    var params = {
      attributes: ['id', 'lon', 'lat', 'name', 'country'],
      where: where,
      order: [['name', 'ASC']], limit: limit
    };

    if (limit > 1)
      return this.findAll(params);

    return this.findOne(params);
  }

  static findCoordinatesByCity(city, country) {
    return this.findOne({attributes: ['lon', 'lat'], where: {name: {[Sequelize.Op.iLike]: city}, country: country}, limit: 1});
  }

  static findCoordinatesById(id) {
    return this.findOne({attributes: ['lon', 'lat'], where: {id: id}});
  }

  static getWeatherByName(name) {
    return this.findName(name, 1)
      .then(res => { return this.wprovider.getWeatherData(res.lon, res.lat) })
      .then(res => { return res.body });
  }

  static getWeatherById(id) {
    return this.findCoordinatesById(id)
      .then(res => { return this.wprovider.getWeatherData(res.lon, res.lat) })
      .then(res => { return res.body });
  }
}
