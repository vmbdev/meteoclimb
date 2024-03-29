import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { getCountry } from '../../helpers/countrycodes.js';
import { convertTemperature, convertWind } from '../../helpers/converters.js';
import CloseButton from '../close-button/close-button.jsx';
import './weather-card.scss';

const inInterval = (value, min, max) => {
  return value >= min && value <= max;
};

/**
 * JSX Component depicting the weather for a given day.
 * @param {Object} props
 * @param {Object} props.conditions  Object representing the weather.
 * @param {string} props.date  Date of the forecast prediction in ISO format.
 * @param {City} props.city  Object representing a city in the database.
 * @param {Function} props.remove  Function to remove the forecast from the
 *     results.
 * @param {Object} props.units  Temperature (temp) and wind (wind) units.
 * @returns The rendered JSX Component.
 */
const WeatherCard = ({ conditions, date, city, units, remove = null }) => {
  const [country, setCountry] = useState({ flag: '', name: '' });
  const [stateClasses, setStateClasses] = useState({
    main: null,
    temp: null,
    wind: null,
    pop: null,
    humidity: null,
    pollution: null,
  });
  const intl = useIntl();

  useEffect(() => {
    const states = {};
    const temp = conditions.temp.max;
    const wind = conditions.wind.speed;
    const pop = conditions.pop.chance;
    const humidity = conditions.humidity;

    const classNames = {
      5: 'forecast--dangerous',
      4: 'forecast--terrible',
      3: 'forecast--bad',
      2: 'forecast--good',
      1: 'forecast--great',
    };

    if (temp <= 5 || temp >= 35) states.temp = 4;
    else if (inInterval(temp, 5, 10) || inInterval(temp, 32, 35))
      states.temp = 3;
    else if (inInterval(temp, 10, 15) || inInterval(temp, 26, 32))
      states.temp = 2;
    else if (inInterval(temp, 15, 26)) states.temp = 1;

    if (wind > 25) states.wind = 4;
    else if (inInterval(wind, 20, 25)) states.wind = 3;
    else if (inInterval(wind, 15, 20)) states.wind = 2;
    else if (inInterval(wind, 0, 15)) states.wind = 1;

    if (pop > 0) states.pop = 4;
    else states.pop = 1;

    if (humidity < 50) states.humidity = 1;
    else if (inInterval(humidity, 50, 75)) states.humidity = 2;
    else if (inInterval(humidity, 75, 90)) states.humidity = 3;
    else if (inInterval(humidity, 90, 100)) states.humidity = 4;

    states.pollution = conditions.aqi ?? 1;

    states.main = Math.max(...Object.values(states));

    setStateClasses(
      Object.fromEntries(
        Object.entries(states).map(([k, v]) => [k, classNames[v]])
      )
    );
  }, [conditions]);

  useEffect(() => {
    setCountry(getCountry(city.country));
  }, [city.country]);

  const getPrecipitation = () => {
    const pop = conditions.pop;
    const amount = Math.round((pop.rain + pop.snow) * 100) / 100;

    if (pop.chance > 0) {
      return (
        <>
          <FormattedMessage
            id="forecast.pop"
            defaultMessage="{chance}% of {type} expected {amount}"
            values={{
              chance: Math.trunc(pop.chance * 100),
              type: intl.formatMessage(
                pop.snow > 0
                  ? { id: 'forecast.snow', defaultMessage: 'snow' }
                  : { id: 'forecast.rain', defaultMessage: 'rain' }
              ),
              amount: amount > 0 ? `(${amount}l)` : '',
            }}
          />
          &nbsp;
          {pop.from && (
            <FormattedMessage
              id="forecast.from"
              defaultMessage="from {time}"
              values={{
                time: DateTime.fromSeconds(pop.from)
                  .setLocale(intl.locale)
                  .toFormat('HH:mm'),
              }}
            />
          )}
        </>
      );
    } else {
      return (
        <FormattedMessage
          id="forecast.nopop"
          defaultMessage="No precipitations expected"
        />
      );
    }
  };

  return (
    <section className={`forecast ${stateClasses.main}`}>
      { remove && <CloseButton closeAction={remove} /> }

      <div className="forecast__title">
        <img className="forecast__flag" src={country.flag} alt={country.name} />

        <h1>
          <FormattedMessage
            id="forecast.title"
            defaultMessage="{city}, {country} on {weekday}"
            values={{
              city: city.name,
              country: country.name,
              weekday: DateTime.fromISO(date).setLocale(intl.locale)
                .weekdayLong,
            }}
          />
        </h1>
      </div>

      <article className="forecast__conditions">
        <article className="forecast__row--centered">
          <span>
            {DateTime.fromSeconds(conditions.sunrise).toFormat('HH:mm')}
          </span>
          <div className="forecast__icon">
            <img
              src="/forecast/daynight.png"
              alt={intl.formatMessage({
                id: 'forecast.daynight',
                defaultMessage: 'Sunrise and sunset',
              })}
            />
          </div>
          <span>
            {DateTime.fromSeconds(conditions.sunset).toFormat('HH:mm')}
          </span>
        </article>

        <article className={`forecast__row ${stateClasses.temp}`}>
          <div className="forecast__icon">
            <img
              src="/forecast/temperature.png"
              alt={intl.formatMessage({
                id: 'forecast.term.temperature',
                defaultMessage: 'Temperature',
              })}
            />
          </div>
          <span>
            <FormattedMessage
              id="forecast.temperature"
              defaultMessage="{temp}º (feels like {feel}º)"
              values={{
                temp: convertTemperature(conditions.temp.max, units.temp),
                feel: convertTemperature(conditions.temp.feel, units.temp),
              }}
            />
          </span>
        </article>

        <article className={`forecast__row ${stateClasses.wind}`}>
          <div className="forecast__icon">
            <img
              src="/forecast/arrow.png"
              alt={intl.formatMessage({
                id: 'forecast.term.wind',
                defaultMessage: 'Wind',
              })}
              title={`${conditions.wind.degrees + 180}º`}
              style={{
                transform: `rotate(${conditions.wind.degrees + 180}deg)`,
              }}
            />
          </div>
          <span>
            <FormattedMessage
              id="forecast.wind"
              defaultMessage="Wind: {speed} {unit}"
              values={{
                speed: convertWind(conditions.wind.speed, units.wind),
                unit: units.wind,
              }}
            />
          </span>
        </article>

        <article className={`forecast__row ${stateClasses.pop}`}>
          <div className="forecast__icon">
            <img
              src={`/forecast/${conditions.weather.name}.png`}
              alt={intl.formatMessage({
                id: `forecast.weather.${conditions.weather.name}`,
              })}
              title={intl.formatMessage({
                id: `forecast.weather.${conditions.weather.name}`,
              })}
            />
          </div>
          <span>{getPrecipitation()}</span>
        </article>

        <article className={`forecast__row ${stateClasses.humidity}`}>
          <div className="forecast__icon">
            <img
              src="/forecast/humidity.png"
              alt={intl.formatMessage({
                id: 'forecast.term.humidity',
                defaultMessage: 'Humidity',
              })}
            />
          </div>
          <span>
            <FormattedMessage
              id="forecast.humidity"
              defaultMessage="{humidity}% humidity"
              values={{ humidity: conditions.humidity }}
            />
          </span>
        </article>

        <article className={`forecast__row ${stateClasses.pollution}`}>
          <div className="forecast__icon">
            <img
              src="/forecast/air-pollution.png"
              alt={intl.formatMessage({
                id: 'forecast.term.pollution',
                defaultMessage: 'Pollution',
              })}
            />
          </div>
          <span>
            <FormattedMessage
              id="forecast.pollution.aiq"
              defaultMessage="Air quality: {quality}"
              values={{
                quality: intl.formatMessage({
                  id: conditions.aqi
                    ? `forecast.pollution.${conditions.aqi}`
                    : 'forecast.pollution.noData'
                }),
              }}
            />
          </span>
        </article>
      </article>
    </section>
  );
};

WeatherCard.propTypes = {
  conditions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  city: PropTypes.object.isRequired,
  remove: PropTypes.func,
  units: PropTypes.object.isRequired,
}

export default WeatherCard;
