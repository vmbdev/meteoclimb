import { Sequelize, DataTypes } from 'sequelize';

export default class City extends Sequelize.Model {
  static init(sequelize) {
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

  static async findByName(location_name, limit = 10) {
    // location_name expects "City" or "City,Country"
    var [city_name, city_country] = location_name.split(',');
    var where = {};

    // where unaccent('name') ILIKE 'city_name%';
    where.name = 
      Sequelize.where(
        Sequelize.fn('unaccent', Sequelize.col('name')),
        { [Sequelize.Op.iLike]: Sequelize.fn('unaccent', city_name + '%') }
      );

    if (city_country)
      where.country = { [Sequelize.Op.iLike]: city_country };

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
    return this.findOne({ attributes: ['lon', 'lat'], where: { name: { [Sequelize.Op.iLike]: city }, country: country } })
      .then((res => { return res.get({ plain: true}) }));
  }

  static findCoordinatesById(id) {
    return this.findByPk(id, { attributes: ['lon', 'lat'] })
      .then((res => { return res.get({ plain: true}) }));
  }
}
