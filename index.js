import config from './config.js';
import OpenWeather from './lib/providers/openweather.js';
import Forecast from './lib/forecast.js';
import City from './lib/city.js';
import db from './database.js';

const wprovider = new OpenWeather(config.weather.apikey, config.weather.units);
City.init(db);
Forecast.init(db, wprovider);

var n = await Forecast.fetchForecast(8224785);
console.log(n);