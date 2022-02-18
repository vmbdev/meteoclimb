import config from './config.js';
import db from './database.js';
import City from './lib/city.js';
import OpenWeather from './lib/providers/openweather.js';
import day_weather from './lib/weather.js';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const x = require('./intern/test.json');

//const wprovider = new OpenWeather(config.weather.apikey, config.weather.units);
//City.init(db, wprovider);

function getUTCEpoch(date) {
  return ~~(date.getTime() / 1000) + (date.getTimezoneOffset() * 60);
}

const now = new Date();
const today = Object.create(day_weather);
const tomorrow = Object.create(day_weather);
const after_tomorrow = Object.create(day_weather);
today.start_time = getUTCEpoch(now);
today.sunrise = x.daily[0].sunrise;
today.sunset = x.daily[0].sunset;

now.setDate(now.getDate() + 1);
now.setHours(0);
now.setMinutes(0);
now.setSeconds(0);
tomorrow.start_time = getUTCEpoch(now);
tomorrow.sunrise = x.daily[1].sunrise;
tomorrow.sunset = x.daily[1].sunset;

now.setDate(now.getDate() + 1);
after_tomorrow.start_time = getUTCEpoch(now);

var current = today;
var next = tomorrow;
x.hourly.forEach(hour => {
  if (hour.dt >= next.start_time) {
    current = tomorrow;
    next = after_tomorrow;
  }
  if ((hour.dt >= current.start_time) && (hour.dt <= next.start_time)) {
    if (hour.pop > 0) {
      current.pop.chance = Math.max(current.pop.chance, hour.pop);

      if (hour.rain["1h"].text > 0)
        current.pop.rain_amount = Math.max(current.pop.rain_amount, hour.rain["1h"].text);

      if (hour.snow["1h"].text > 0)
        current.pop.snow_amount = Math.max(current.pop.snow_amount, hour.snow["1h"].text);
    }
    if ((hour.dt >= current.sunrise) && (hour.dt <= current.sunset)) {
      current.wind_speed = Math.max(current.wind_speed, hour.wind_speed);
      current.humidity = Math.max(current.humidity, hour.humidity);
    }
  }
});

console.log(today, today.pop, tomorrow, tomorrow.pop);
