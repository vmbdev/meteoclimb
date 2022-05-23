/**
 * Express controller providing Forecast related routes
 * @module controllers/forecast
 * @requires model/forecast
 * @requires model/forecastlog
 */

import { Op } from 'sequelize';
import { DateTime } from 'luxon';

import City from './city.model.js';
import Forecast from './forecast.model.js';
import ForecastLog from './forecastlog.model.js';
import WeatherProviderFactory from './weatherproviderfactory.js';

const weatherProvider = WeatherProviderFactory.create()

const updatedLastDay = (lastUpdate) => {
  let diff = DateTime.fromJSDate(lastUpdate).diffNow('days').days;
  return (-1 <= diff);
}

/**
 * Fetches the forecast from the weather provider
 * @param {number} lon - The longitude for the area requested
 * @param {number} lat - The latitude for the area requested
 * @returns {Promise} - An object with the weekly forecast
 */
const fetchProviderForecast = async (weatherProvider, lon, lat) => {
  return weatherProvider.getWeatherData(lon, lat);
}

const createConditions = () => {
  return {
    sunrise: NaN,
    sunset: NaN,
    humidity: 0,
    temp: {
      max: NaN,
      feel: NaN
    },
    wind: {
      speed: 0,
      degrees: NaN
    },
    pop: {
      chance: 0,
      from: NaN,
      rain_amount: 0,
      snow_amount: 0
    }
  }
}

const parseData = (data) => {
  let weeklyForecast = [];
  let startTomorrow = DateTime.utc().plus({ days: 1 }).toUnixInteger();
  let startAftertomorrow = DateTime.utc().plus({ days: 2 }).toUnixInteger();
  
  data.daily.forEach(day => {
    let current = createConditions();

    current.start_time = day.dt;
    current.sunrise = day.sunrise;
    current.sunset = day.sunset;
    current.temp.max = day.temp.day;
    current.temp.feel = day.feels_like.day;
    current.wind.degrees = day.wind_deg;
    
    if ((day.dt < startTomorrow) || (day.dt < startAftertomorrow)) {
      let currentHourly = data.hourly.filter(hour => ((hour.dt > current.sunrise) && (hour.dt < current.sunset)));
      for (let hour of currentHourly) {
        current.wind.speed = Math.max(current.wind.speed, hour.wind_speed);
        current.humidity = Math.max(current.humidity, hour.humidity);

        if (hour.pop > 0) {
          current.pop.chance = Math.max(current.pop.chance, hour.pop);
          if (!current.pop.from) current.pop.from = hour.dt;
          if (hour.rain && hour.rain['1h'] > 0) current.pop.rain_amount = Math.max(current.pop.rain_amount, hour.rain['1h']);
          if (hour.snow && hour.snow['1h'] > 0) current.pop.snow_amount = Math.max(current.pop.snow_amount, hour.snow['1h']);
        }
      }
    }
    else {
      current.wind.speed = day.wind_speed;
      current.humidity = day.humidity;
      if (day.pop > 0) {
        current.pop.chance = day.pop;
        
        if (day.rain)
        current.pop.rain_amount = day.rain;
        
        if (day.snow)
        current.pop.snow_amount = day.snow;
      }
    }
    weeklyForecast.push(current);
  });
  
  return weeklyForecast;
}

const storeForecast = async (weeklyForecast, cityId) => {
  await Forecast.destroy({ where: { cityId: cityId }});

  for (let dailyForecast of weeklyForecast) {
    await Forecast.create({
      date: DateTime.fromSeconds(dailyForecast.start_time).toJSDate(),
      cityId: cityId,
      conditions: dailyForecast
    });
  }
}

const fetchForecast = async (cityId, dateList = [0]) => {
  const city = await City.findByPk(cityId);
  if (!city) throw new Error('City id not found');

  let log = await ForecastLog.findOne({ where: { cityId: cityId }});
  
  if (!log || !updatedLastDay(log.updatedAt)) {
    await fetchProviderForecast(weatherProvider, city.lon, city.lat)
      .then(async (weeklyForecast) => { await storeForecast(parseData(weeklyForecast), cityId) })
      .then(async () => {
        await ForecastLog.upsert({
          id: log ? log.id : null,
          cityId: cityId
        })
      });
  }

  let forecast = await Forecast.findAll(
    {
      attributes: { exclude: ['id', 'cityId'] },
      include: {
        model: City,
        attributes: { exclude: ['updatedAt', 'createdAt'] }
      },
      where: {
        cityId: cityId,
        date: { [Op.or]: dateList.map(i => DateTime.now().plus({ days: i }).toJSDate()) }
      },
    }
  );

  return forecast;
}

const getForecast = async (req, res) => {
  let dateList;
  // separate the parameters, convert the strings to numbers ("2" -> 2),
  // remove the falsy elements and check 0>=j<=6
  if (req.params.dateOffset) {
    dateList =
      req.params.dateOffset
        .split(';')
        .map(i => parseInt(i))
        .filter(j => j >= 0 && j <= 6);
  }
  else dateList = [0];

  fetchForecast(req.params.cityId, dateList)
    .then(forecast => { res.json(forecast) })
    .catch(e => { res.json({ error: e }) });
}

const ForecastController = { getForecast }
export default ForecastController;