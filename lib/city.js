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
    return this.findOne({ attributes: ['lon', 'lat'], where: { name: { [Sequelize.Op.iLike]: city }, country: country } });
  }

  static findCoordinatesById(id) {
    return this.findOne({ attributes: ['lon', 'lat'], where: { id: id } });
  }
}
