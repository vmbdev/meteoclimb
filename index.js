import config from './config.js';
import db from './database.js';
import City from './lib/city.js';
import OpenWeather from './lib/providers/openweather.js';
import DayForecast from './lib/dayforecast.js';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const x = require('./intern/test.json');

//const wprovider = new OpenWeather(config.weather.apikey, config.weather.units);
//City.init(db, wprovider);

function getUTCEpoch(date) {
  return ~~(date.getTime() / 1000) + (date.getTimezoneOffset() * 60);
}

/*
const now = new Date();
const today = new DayForecast();
const tomorrow = new DayForecast();
const after_tomorrow = new DayForecast();
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
    if ((hour.dt >= current.sunrise) && (hour.dt <= current.sunset)) {
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
    }
  }
});
*/


//console.log(today, tomorrow, '----------------');

var forecast = [];
const now = new Date();
now.setDate(now.getDate() + 1);
var timetom = getUTCEpoch(now);
now.setDate(now.getDate() + 1);
var timeaft = getUTCEpoch(now);

x.daily.forEach(day => {
  var current = new DayForecast();

  current.start_time = day.dt;
  current.sunrise = day.sunrise;
  current.sunset = day.sunset;
  current.temp.max_temp = day.temp.day;
  current.temp.feels_like = day.feels_like.day;
  current.wind.degrees = day.wind_deg;

  if ((day.dt < timetom) || (day.dt < timeaft)) {
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

console.log(forecast);
