/**
 * @module Forecast
 */
import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { FormattedMessage, useIntl } from 'react-intl';
import CloseButton from '../close-button/close-button.jsx';
import { getCountry } from '../../helpers/countrycodes.js';
import './forecast.scss';
import './forecast-sprites.scss';

/**
 * JSX Component depicting the forecast for a given day.
 * @param {Object} props
 * @param {Object} props.conditions  Object representing the weather.
 * @param {Date} props.date  Date of the forecast prediction.
 * @param {City} props.city  Object representing a city in the database.
 * @param {Function} props.remove  Function to remove the forecast from the
 *     results.
 * @returns The rendered JSX Component.
 */
const Forecast = ({ conditions, date, city, remove }) => {
  const [country, setCountry] = useState({ flag: '', name: '' });
  const [stateClasses, setStateClasses] = useState({
    main: null,
    temp: null,
    wind: null,
    pop: null,
    humidity: null
  });
  const intl = useIntl();

  useEffect(() => {
    const inInterval = (value, min, max) => {
      return (value >= min && value <= max);
    }

    let states = {};
    const temp = conditions.temp.max;
    const wind = conditions.wind.speed;
    const pop = conditions.pop.chance;
    const humidity = conditions.humidity;

    const classNames = {
      0: 'forecast--terrible',
      1: 'forecast--bad',
      2: 'forecast--good',
      3: 'forecast--great'
    }

    if (temp <= 5 || temp >= 35) states.temp = 0;
    else if (inInterval(temp, 5, 10) || inInterval(temp, 32, 35)) states.temp = 1;
    else if (inInterval(temp, 10, 15) || inInterval(temp, 26, 32)) states.temp = 2;
    else if (inInterval(temp, 15, 26)) states.temp = 3;

    if (wind > 25) states.wind = 0;
    else if (inInterval(wind, 20, 25)) states.wind = 1;
    else if (inInterval(wind, 15, 20)) states.wind = 2;
    else if (inInterval(wind, 0, 15)) states.wind = 3;

    if (pop > 0) states.pop = 0;
    else states.pop = 3;

    if (humidity < 50) states.humidity = 3;
    else if (inInterval(humidity, 50, 75)) states.humidity = 2;
    else if (inInterval(humidity, 75, 90)) states.humidity = 1;
    else if (inInterval(humidity, 90, 100)) states.humidity = 0;

    states.main = Math.min(...Object.values(states));

    setStateClasses(
      Object.fromEntries(
        Object
          .entries(states)
          .map(([k,v]) => [k, classNames[v]])
      )
    );
    setCountry(getCountry(city.country));
  }, [conditions, city.country]);

  const getPrecipitation = () => {
    const pop = conditions.pop;
    const amount = pop.rain + pop.snow;

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
          { pop.from &&
            <FormattedMessage
              id="forecast.from"
              defaultMessage="from {time}"
              values={ {
                time: 
                  DateTime
                    .fromSeconds(pop.from)
                    .setLocale(intl.locale)
                    .toFormat('HH:mm')
              } }
            />
          }
        </>
      );
    }

    else return (
      <FormattedMessage
        id="forecast.nopop"
        defaultMessage="No precipitations expected"
      />
    );
  }

  return (
    <div className={ `forecast ${ stateClasses.main }` }>
      <CloseButton closeAction={ remove }/>

      <div className="forecast__row forecast__title">
        <img
          className="forecast__flag"
          src={ country.flag }
          alt={ country.name }
        />
        <FormattedMessage
          id="forecast.title"
          defaultMessage="{city}, {country} on {weekday}"
          values={{
            city: city.name,
            country: country.name,
            weekday: DateTime.fromISO(date).setLocale(intl.locale).weekdayLong
          }}
        />
      </div>

      <div className="forecast__row--centered">
        <div>
          { DateTime.fromSeconds(conditions.sunrise).toFormat('HH:mm') }
        </div>
        <div className="forecast__icon--daynight"></div>
        <div>
          { DateTime.fromSeconds(conditions.sunset).toFormat('HH:mm') }
        </div>
      </div>

      <div className={ `forecast__row ${ stateClasses.temp }` }>
        <div className="forecast__icon--temperature" />
        <div>
          <FormattedMessage
            id="forecast.temperature"
            defaultMessage="{temp}º (feels like {feel}º)"
            values={{
              temp: conditions.temp.max,
              feel: conditions.temp.feel
            }}
          />
        </div>
      </div>

      <div className={ `forecast__row ${ stateClasses.wind }` }>
        <div
          className="forecast__icon--arrow"
          style={{ transform: `rotate(${ conditions.wind.degrees + 180 }deg)` }}
        />
        <div>
        <FormattedMessage
            id="forecast.wind"
            defaultMessage="Wind: {speed} {unit}"
            values={{
              speed: conditions.wind.speed,
              // TODO variable unit system
              unit: 'km/h'
            }}
          />

        </div>
      </div>

      <div className={ `forecast__row ${ stateClasses.pop }` }>
        <div className="forecast__icon--rain" />
        <div>{ getPrecipitation() }</div>
      </div>

      <div className={ `forecast__row ${ stateClasses.humidity }` }>
        <div className="forecast__icon--humidity"></div>
        <div>
          <FormattedMessage
            id="forecast.humidity"
            defaultMessage="{humidity}% humidity"
            values={{humidity: conditions.humidity}}
          />
        </div>
      </div>
    </div>
  );
}

export default Forecast;