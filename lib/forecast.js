import { Sequelize, DataTypes } from 'sequelize';

export default class Forecast extends Sequelize.Model {
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
    });

    if (wprovider instanceof WeatherProvider)
      this.wprovider = wprovider;
    else
      throw 'Provider not valid';
  }
}
