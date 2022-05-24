import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { getCountry } from '../../helpers/countrycodes.js';
import './forecast.scss';
import './forecast-sprites.scss';

const Forecast = (props) => {
  const [country, setCountry] = useState({ flag: '', name: '' });
  const [stateClasses, setStateClasses] = useState({ main: null, temp: null, wind: null, pop: null, humidity: null});

  useEffect(() => {
    const inInterval = (value, min, max) => {
      return (value >= min && value <= max);
    }

    let states = {};
    let temp = props.conditions.temp.max;
    let wind = props.conditions.wind.speed;
    let pop = props.conditions.pop.chance;
    let humidity = props.conditions.humidity;

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
      Object.fromEntries(Object.entries(states).map(([k,v]) => [k, classNames[v]]))
    );
    setCountry(getCountry(props.city.country));
  }, [props.conditions, props.city.country]);


  const getPrecipitation = () => {
    let pop = props.conditions.pop;
    let amount = pop.rain_amount + pop.snow_amount;
    if (pop.chance > 0) {
      return (
        `${Math.trunc(pop.chance * 100)}% chance of ${pop.rain_amount > 0 ? 'rain' : 'snow'}
        expected ${amount > 0 ? `(${amount}l)` : ''}
        ${pop.from ? 'from ' + DateTime.fromSeconds(pop.from).toFormat('HH:mm') : ''}`
      );
    }

    else return 'No precipitations expected';
  }

  return (
    <div className={ `forecast ${ stateClasses.main }` }>
      <button className="forecast__close" onClick={ () => { props.remove(props.index) } }>&#10006;</button>
      <div className="forecast__row forecast__title">
        <img className="forecast__flag" src={ country.flag } alt={ country.name } />
        { props.city.name }, { country.name } on { DateTime.fromISO(props.date).weekdayLong }
      </div>
      <div className={ `forecast__row ${ stateClasses.temp }` }>
        <div className="forecast__icon--temperature" />
        <div>{ props.conditions.temp.max }&ordm; (feels like { props.conditions.temp.feel }&ordm;)</div>
      </div>
      <div className={ `forecast__row ${ stateClasses.wind }` }>
        <div className="forecast__icon--arrow" style={{ transform: `rotate(${ props.conditions.wind.degrees + 180 }deg)` }} />
        <div>Wind: { props.conditions.wind.speed } km/h</div>
      </div>
      <div className={ `forecast__row ${ stateClasses.pop }` }>
        <div className="forecast__icon--rain" />
        <div>{ getPrecipitation() }</div>
      </div>
      <div className={ `forecast__row ${ stateClasses.humidity }` }>
        <div className="forecast__icon--humidity"></div>
        <div>{ props.conditions.humidity }% humidity</div>
      </div>
    </div>
  );
}

export default Forecast;