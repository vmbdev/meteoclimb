import got from 'got';
import { Sequelize, DataTypes } from 'sequelize';
import config from './config.js';
import { db, City } from './database.js';
import WeatherProvider from './lib/weatherprovider.js';
import OpenWeather from './lib/providers/openweather.js';

const wprovider = new OpenWeather(config.weather.apikey, config.weather.units);
City.init(db, wprovider);

if (process.argv.length > 2) {
  City.getWeatherByName(process.argv[2])
  .then(body => console.log(body.body));

  City.close();
}
