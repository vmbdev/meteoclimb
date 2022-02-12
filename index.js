import got from 'got';
import { Sequelize, DataTypes } from 'sequelize';
import config from './config.js';
import { db, City } from './database.js';
import WeatherProvider from './lib/weatherprovider.js';
import OpenWeather from './lib/providers/openweather.js';

City.findAll(
  {
    where: { country: 'ES' }
  }
).then((x) => console.log(x));
