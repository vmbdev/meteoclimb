import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { toaster } from '../../services/toaster.js';
import WeatherCard from '../weather-card/weather-card.jsx';
import './weather-list.scss';

/**
 * JSX Component displaying the results of a weather search.
 * @param {Object} props
 * @param {Array<Promise<Object[]>>} props.searchResults  An array of Promises
 *     with the results to be displayed.
 * @param {Function} props.saveToStorage  A function to store the results
 *     somewhere (i.e. local storage).
 * @param {Object} props.units  The units of the measurements to be used.
 * @returns The rendered JSX component.
 */
const WeatherList = ({
  searchResults,
  saveToStorage,
  units = { temp: 'celsius', wind: 'kmh' },
}) => {
  const [results, setResults] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    (async () => {
      if (searchResults && searchResults.forecast) {
        try {
          const forecast = await searchResults.forecast;

          setResults((prevRes) => [
            { city: searchResults.city, forecast },
            ...prevRes,
          ]);
        } catch (err) {
          toaster.error(
            intl.formatMessage({
              id: 'results.error.forecast',
              defaultMessage: 'Error fetching forecast.',
            }),
            'forecast-error'
          );
        }

      }
    })();
  }, [searchResults]);

  useEffect(() => {
    save();
  }, [results]);

  /**
   * Creates a storable summary of the current results and sends it to the
   * parent throught props.save.
   */
  const save = () => {
    if (results && results.length > 0) {
      const storableResults = {};

      for (const item of results) {
        const id = item.city.id;
        const dates = item.forecast.map((forecast) => forecast.date);

        storableResults[id] = dates;
      }
      saveToStorage(storableResults);
    }
  };

  /**
   * Removes an object from the results.
   * @param {number} index  The index of the object to be removed.
   */
  const remove = (indexCity, indexForecast) => {
    const newResults = [...results];

    newResults[indexCity].forecast.splice(indexForecast, 1);

    if (newResults[indexCity].forecast.length === 0) {
      newResults.splice(indexCity, 1);
    }

    setResults(newResults);

    if (newResults.length === 0) saveToStorage([]);
  };

  /**
   * Function to scroll the results horizontally.
   * @param {Event} event  The event triggering the function (i.e. onWheel)
   */
  const scrollResults = (event) => {
    const amount = event.deltaY > 0 ? 100 : -100;

    event.currentTarget.scrollBy(amount, 0);
  };

  const getNoResultsClassName = () => {
    return results.length === 0 ? 'results--collapsed' : '';
  };

  return (
    <ul
      className={`results__list ${getNoResultsClassName()}`}
      onWheel={scrollResults}
    >
      {results.map(({ city, forecast }, indexCity) =>
        forecast.map((res, indexForecast) => (
          <li key={`${city.id}+${res.date}`}>
            <WeatherCard
              date={res.date}
              city={city}
              conditions={res.conditions}
              units={units}
              remove={() => {
                remove(indexCity, indexForecast);
              }}
            />
          </li>
        ))
      )}
    </ul>
  );
};

WeatherList.propTypes = {
  searchResults: PropTypes.object,
  saveToStorage: PropTypes.func,
  units: PropTypes.object,
}

export default WeatherList;
