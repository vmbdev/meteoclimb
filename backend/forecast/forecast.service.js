/**
 * @module ForecastService
 */

import { Op } from 'sequelize';
import { DateTime } from 'luxon';

import City from '../city/city.model.js';
import Forecast from './forecast.model.js';
import ForecastLog from './forecastlog.model.js';
import WeatherProviderFactory from '../weatherproviderfactory.js';

import { config } from '../config/meteo.config.js';
import MeteoError from '../meteoerror.js';

/**
 * Service to fetch, process and store the forecast.
 * @class
 */
class ForecastService {
  weatherProvider = WeatherProviderFactory.create(
    config.weather.provider,
    config.weather.apikey,
    config.weather.units
  );

  /**
   * Creates a default object containing the structure of the daily weather.
   * @returns An object representing the weather for a day.
   */
  createConditions() {
    return {
      sunrise: NaN,
      sunset: NaN,
      humidity: 0,
      temp: {
        max: NaN,
        feel: NaN,
      },
      wind: {
        speed: 0,
        degrees: NaN,
      },
      pop: {
        chance: 0,
        from: NaN,
        rain: 0,
        snow: 0,
      },
    };
  }

  /**
   * Converts a weekly forecast object into the format read by meteoclimb.
   * @param {Object} data  Object containing the provider's weather for a week.
   * @returns {Object}  Object containing the processed weather for a week.
   */
  parseData(data) {
    const weeklyForecast = [];
    const startTomorrow = DateTime.utc().plus({ days: 1 }).toUnixInteger();
    const startAfterTomorrow = DateTime.utc().plus({ days: 2 }).toUnixInteger();

    // data contains an object per day of the week
    data.daily.forEach((day) => {
      const current = this.createConditions();

      current.start_time = day.dt;
      current.sunrise = day.sunrise;
      current.sunset = day.sunset;
      current.temp.max = Math.round(day.temp.day);
      current.temp.feel = Math.round(day.feels_like.day);
      current.wind.degrees = day.wind_deg;

      /**
       * the next 24 hours are represented hourly (data.hourly), so we use
       * startTomorrow and startAfterTomorrow to compute the data for what's
       * remaining of today and tomorrow.
       */
      if (day.dt < startTomorrow || day.dt < startAfterTomorrow) {
        const currentHourly = data.hourly.filter(
          (hour) => hour.dt > current.sunrise && hour.dt < current.sunset
        );

        for (const hour of currentHourly) {
          // max humidity and wind speed is always the worst possible scenario
          current.wind.speed = Math.max(current.wind.speed, hour.wind_speed);
          current.humidity = Math.max(current.humidity, hour.humidity);

          if (hour.pop > 0) {
            current.pop.chance = Math.max(current.pop.chance, hour.pop);

            if (!current.pop.from) current.pop.from = hour.dt;

            if (hour.rain && hour.rain['1h'] > 0) {
              current.pop.rain = Math.max(current.pop.rain, hour.rain['1h']);
            }

            if (hour.snow && hour.snow['1h'] > 0) {
              current.pop.snow = Math.max(current.pop.snow, hour.snow['1h']);
            }
          }
        }
      } else {
        current.wind.speed = day.wind_speed;
        current.humidity = day.humidity;

        if (day.pop > 0) {
          current.pop.chance = day.pop;

          if (day.hasOwnProperty('rain')) current.pop.rain = day.rain;
          if (day.hasOwnProperty('snow')) current.pop.snow = day.snow;
        }
      }
      weeklyForecast.push(current);
    });

    return weeklyForecast;
  }

  /**
   * Stores in the database the forecast objects.
   * @async
   * @param {Object} weeklyForecast  The object to be stored
   * @param {number} cityId  The ID referencing the city in the database
   */
  async storeForecast(weeklyForecast, cityId) {
    await Forecast.destroy({ where: { cityId } });

    for (const dailyForecast of weeklyForecast) {
      await Forecast.create({
        date: DateTime.fromSeconds(dailyForecast.start_time).toJSDate(),
        cityId,
        conditions: dailyForecast,
      });
    }
  }

  /**
   * Check if a forecast prediction was stored less than 24 hours ago.
   * If so, we fetch it from the database.
   * @param {Date} lastUpdate  Date containing the time it was obtained.
   * @returns {boolean}  True if it was updated less than 24 hours ago.
   */
  updatedLastDay(lastUpdate) {
    const diff = DateTime.fromJSDate(lastUpdate).diffNow('days').days;
    return -1 <= diff;
  }

  /**
   * Fetch the weather forecast for the city and dates provided.
   * It will grab the data from the database if it was requested less than a
   * day ago, or it will fetch it from the provider if not.
   * @async
   * @param {*} cityId
   * @param {*} dateList
   * @returns {Array}  Array of forecasts.
   */
  async fetchForecast(cityId, dateList = [0]) {
    const city = await City.findByPk(cityId);

    if (!city) throw new MeteoError('City ID not found');

    const log = await ForecastLog.findOne({ where: { cityId } });

    if (!log || !this.updatedLastDay(log.updatedAt)) {
      const weatherData = await this.weatherProvider.getWeatherData(
        city.lon,
        city.lat
      );

      await this.storeForecast(this.parseData(weatherData), cityId);
      await ForecastLog.upsert({
        id: log ? log.id : null,
        cityId,
      });
    }

    const forecast = Forecast.findAll({
      attributes: { exclude: ['id', 'cityId'] },
      // include: {
      //   model: City,
      //   attributes: { exclude: ['updatedAt', 'createdAt'] },
      // },
      where: {
        cityId,
        date: {
          [Op.or]: dateList.map((i) =>
            DateTime.now().plus({ days: i }).toJSDate()
          ),
        },
      },
    });

    return forecast;
  }
}

const forecastService = new ForecastService();
export default forecastService;
