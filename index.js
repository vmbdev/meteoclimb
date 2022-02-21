import config from './config.js';
import OpenWeather from './lib/providers/openweather.js';
import DayForecast from './lib/dayforecast.js';
import Forecast from './lib/forecast.js';
import City from './lib/city.js';
import db from './database.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const x = require('./intern/test.json');

const wprovider = new OpenWeather(config.weather.apikey, config.weather.units);
City.init(db);

function getUTCEpoch(date) {
  return ~~(date.getTime() / 1000) + (date.getTimezoneOffset() * 60);
}

var forecast = [];
const now = new Date();
now.setDate(now.getDate() + 1);
var start_tomorrow = getUTCEpoch(now);
now.setDate(now.getDate() + 1);
var start_aftertomorrow = getUTCEpoch(now);

x.daily.forEach(day => {
  var current = new DayForecast();

  current.start_time = day.dt;
  current.sunrise = day.sunrise;
  current.sunset = day.sunset;
  current.temp.max_temp = day.temp.day;
  current.temp.feels_like = day.feels_like.day;
  current.wind.degrees = day.wind_deg;

  if ((day.dt < start_tomorrow) || (day.dt < start_aftertomorrow)) {
    x.hourly
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

Forecast.init(db, new OpenWeather(config.weather.apikey, config.weather.units));
Forecast.sync({ force: true });
