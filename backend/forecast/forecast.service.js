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
  parseWeather(data) {
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
      current.weather = {
        id: day.weather[0].id,
        name: this.parseWeatherName(day.weather[0].id),
      }

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
   * Converts a 4-day air pollution forecast into an storable object.
   * @param {Object} pollution  Object containing the pollution forecast from
   *     the provider.
   * @returns {Array}  The list of air quality indexes and their dates.
   */
  parseAirPollution(pollution) {
    const forecast = [];

    for (const item of pollution.list) {
      const curDate = DateTime.fromSeconds(item.dt).toUTC();
      const day = curDate.diffNow('days').days;

      if (day >= 0) {
        const index = Math.trunc(day);
        if (forecast[index])
          forecast[index].aqi = Math.max(forecast[index].aqi, item.main.aqi);
        else
          forecast[index] = {
            aqi: item.main.aqi,
            date: curDate.toJSDate(),
          };
      }
    }

    return forecast;
  }

  /**
   * Stores in the database the forecast objects.
   * @async
   * @param {number} cityId  The ID referencing the city in the database
   * @param {Object} weather  The weather to be stored
   * @param {Array} pollution  The air pollution to be stored
   */
  async storeForecast(cityId, weather, pollution) {
    await Forecast.destroy({ where: { cityId } });

    for (let i = 0; i < weather.length; i++) {
      await Forecast.create({
        date: DateTime.fromSeconds(weather[i].start_time).toJSDate(),
        cityId,
        conditions: {
          ...weather[i],
          aqi: pollution[i] ? pollution[i].aqi : null,
        }
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
      const [weatherData, pollutionData] = await Promise.all([
        this.weatherProvider.getWeatherData(city.lon, city.lat),
        this.weatherProvider.getAirPollutionData(city.lon, city.lat),
      ]);

      await this.storeForecast(
        cityId,
        this.parseWeather(weatherData),
        this.parseAirPollution(pollutionData),
      );
      await ForecastLog.upsert({
        id: log ? log.id : null,
        cityId,
      });
    }

    const forecast = Forecast.findAll({
      attributes: { exclude: ['id', 'cityId'] },
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

  /**
   * Fetch the air quality forecast from the provider.
   * @async
   * @param {number} cityId  The city ID to look for.
   * @returns {Array}  The air quality forecast.
   */
  async fetchAirPollution(cityId) {
    const city = await City.findByPk(cityId);

    if (!city) throw new MeteoError('City ID not found');

    const airPollutionData = await this.weatherProvider.getAirPollutionData(
      city.lon,
      city.lat
    );

    return airPollutionData;
  }

  /**
   * OpenWeatherMap provides a set of three digit codes for multiple weather
   * conditions. The first digit determines the kind of weather, and we don't
   * get into much detail (if it rains, it rains, doesn't matter what kind).
   * Here we provide a human legible form.
   * @param {number} weatherId  The code identifiyng the weather.
   * @returns {string}  The legible form of the weather.
   */
  parseWeatherName(weatherId) {
    const id = Math.trunc(weatherId / 100);
    let value;

    switch (id) {
      case 2: {
        value = 'thunderstorm';
        break;
      }
      case 3: {
        value = 'drizzle';
        break;
      }
      case 5: {
        value = 'rain';
        break;
      }
      case 6: {
        value = 'snow';
        break;
      }
      case 7: {
        value = 'atmosphere';
        break;
      }
      case 8: {
        if (weatherId === 800) value = 'clear';
        else value = 'clouds';
        break;
      }
    }

    return value;
  }
}

const forecastService = new ForecastService();
export default forecastService;
