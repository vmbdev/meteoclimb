import got from 'got';
import { Sequelize, DataTypes } from 'sequelize';
import config from './config.js';
import db from './database.js';
import City from './lib/city.js';
import OpenWeather from './lib/providers/openweather.js';
import fs from 'fs';

const wprovider = new OpenWeather(config.weather.apikey, config.weather.units);
City.init(db, wprovider);

City.getWeatherById(process.argv[2]).then(x => fs.writeFile('test.json', JSON.stringify(x), err => { if (err) throw err; console.log('saved');}));
