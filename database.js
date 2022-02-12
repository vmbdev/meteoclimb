import { Sequelize, DataTypes } from 'sequelize';
import config from './config.js';

export const db = new Sequelize(config.database.name, config.database.user, config.database.password, {
  query: { raw: true },
  host: config.database.host,
  dialect: config.database.dialect
});

export class City extends Sequelize.Model {
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
    })
  }

  static async findName(name) {
    var carr = name.split(',');
    var where = {};

    where.name = { [Sequelize.Op.iLike]: carr[0] + '%' };

    if (carr.length > 1)
      where.country = { [Sequelize.Op.iLike]: carr[1] };

    return this.findAll(
      {
        attributes: ['id', 'lon', 'lat', 'name', 'country'],
        where: where,
        order: [['name', 'ASC']], limit: 10
      });
  }

  static async findCoordinatesByCity(city, country) {
    return this.findOne({attributes: ['lon', 'lat'], where: {name: {[Sequelize.Op.iLike]: city}, country: country}, limit: 1});
  }

  static async findCoordinatesById(id) {
    return this.findOne({attributes: ['lon', 'lat'], where: {id: id}});
  }
}

City.init(db);

if (process.argv.length >2) {
  City.findName(process.argv[2]).then(coordinates => {
    console.log(coordinates);
    db.close();
  });
}
