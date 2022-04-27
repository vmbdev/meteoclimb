import { Sequelize, DataTypes } from 'sequelize';
import City from './city.model.js';
import WeatherProvider from './weatherprovider.js';
import DayForecast from './dayforecast.js';

export default class Forecast extends Sequelize.Model {
  static init(sequelize, wprovider) {
    if (wprovider instanceof WeatherProvider)
      this.wprovider = wprovider;
    else
      throw new Error('Provider not valid');
      
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
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'id'
        }
      }

    }, {
      sequelize,
      modelName: 'forecast'
    });

    this.belongsTo(City, { foreignKey: { unique: true }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }

  static getUTCEpoch(date) {
    return ~~(date.getTime() / 1000) + (date.getTimezoneOffset() * 60);
  }

  static async getProviderForecast(lon, lat) {
    return this.wprovider.getWeatherData(lon, lat)
    .then(res => { return res });
  }
  
  static parseData(data) {    
    var forecast = [];
    const now = new Date();
    now.setDate(now.getDate() + 1);
    var start_tomorrow = this.getUTCEpoch(now);
    now.setDate(now.getDate() + 1);
    var start_aftertomorrow = this.getUTCEpoch(now);
    
    data.daily.forEach(day => {
      var current = new DayForecast();
      
      current.start_time = day.dt;
      current.sunrise = day.sunrise;
      current.sunset = day.sunset;
      current.temp.max_temp = day.temp.day;
      current.temp.feels_like = day.feels_like.day;
      current.wind.degrees = day.wind_deg;
      
      if ((day.dt < start_tomorrow) || (day.dt < start_aftertomorrow)) {
        data.hourly
        .filter(hour => { return ((hour.dt > current.sunrise) && (hour.dt < current.sunset)); })
        .forEach(hour => {
          current.wind.speed = Math.max(current.wind.speed, hour.wind_speed);
          current.humidity = Math.max(current.humidity, hour.humidity);
          
          if (hour.pop > 0) {
            current.pop.chance = Math.max(current.pop.chance, hour.pop);
            if (!current.pop.from)
            current.pop.from = hour.dt;
            
            if ((hour.rain) && (hour.rain['1h'] > 0))
            current.pop.rain_amount = Math.max(current.pop.rain_amount, hour.rain['1h']);
            
            if ((hour.snow) && (hour.snow['1h'] > 0))
                current.pop.snow_amount = Math.max(current.pop.snow_amount, hour.snow['1h']);
              }
          });
        }
        
        else {
          current.wind.speed = day.wind_speed;
          current.humidity = day.humidity;
          if (day.pop > 0) {
            current.pop.chance = day.pop;
          if (day.rain) current.pop.rain_amount = day.rain;
          if (day.snow) current.pop.snow_amount = day.snow;
        }
      }
      forecast.push(current);
    });

    return forecast;
  }

  static storeForecast(raw_forecast, city_id) {
    if (raw_forecast.length < 7)
    throw new Error('Incorrect forecast size');
    
    const forecast = this.parseData(raw_forecast);
    
    var forecast_columns = {};
    for (var i = 0; i < 7; i++)
      forecast_columns["day"+(i+1)] = forecast[i];

    forecast_columns.cityId = city_id;
      
    return this.upsert(forecast_columns, { returning: true });
  }
    
  static async fetchForecast(city_id) {
    const city = await City.findByPk(city_id);
    
    if (!city)
      throw new Error('City id not found');
    
    var update = false;
    var forecast = await this.findOne({where: { cityId: city_id }});
    
    if (forecast) {
      const last_updated = ~~(Date.parse(forecast.updatedAt) / 1000);
      const now = ~~(Date.now() / 1000);

      if ((now - last_updated) > 24*60*60)
        update = true;
    }
    else 
      update = true;
    
    if (update) {
      forecast = await this.getProviderForecast(city.lon, city.lat)
        .then(data => { return this.storeForecast(data, city_id) })
        .then(forecast => { return forecast[0] });
    }

    return forecast;
  }
}
