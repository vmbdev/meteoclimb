/**
 * @module Results
 */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toaster } from '../../services/toaster';
import Forecast from '../forecast/forecast.jsx';
import './results.scss';

/**
 * JSX Component displaying the results of a weather search.
 * @param {Object} props
 * @param {Array<Promise<Object[]>>} props.searchResults  An array of Promises
 *     with the results to be displayed.
 * @param {Function} props.saveToStorage  A function to store the results
 *     somewhere (i.e. local storage).
 * @returns The rendered JSX component.
 */
const Results = ({
  searchResults,
  saveToStorage,
  units = { temp: 'celsius', wind: 'kmh' },
}) => {
  const [results, setResults] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    (async () => {
      if (searchResults && searchResults.length > 0) {
        const resolveProms = await Promise.allSettled(searchResults);

        const validResults = resolveProms
          .filter((res) => res.status === 'fulfilled')
          .map((res) => res.value)
          .flat();

        if (resolveProms.some((res) => res.status === 'rejected')) {
          toaster.error(
            intl.formatMessage({
              id: 'results.error.forecast',
              defaultMessage: 'Error fetching forecast.',
            }),
            'forecast-error'
          );
        }

        setResults((prevRes) => [...validResults, ...prevRes]);
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
        const id = item.City.id;

        if (!storableResults[id]) storableResults[id] = [];

        storableResults[id].push(item.date);
      }
      saveToStorage(storableResults);
    }
  };

  /**
   * Removes an object from the results.
   * @param {number} index  The index of the object to be removed.
   */
  const remove = (index) => {
    const newResults = [...results];

    newResults.splice(index, 1);
    setResults(newResults);

    if (newResults.length === 0) saveToStorage([]);
  };

  /**
   * Function to scroll the results horizontally.
   * @param {Event} event  The event triggering the function (i.e. onWheel)
   */
  const scrollResults = (event) => {
    let amount = event.deltaY > 0 ? 100 : -100;

    event.currentTarget.scrollBy(amount, 0);
  };

  const getNoResultsClassName = () => {
    return results.length === 0 ? 'results--collapsed' : '';
  };

  return (
    <div
      className={`results__list ${getNoResultsClassName()}`}
      onWheel={scrollResults}
    >
      {results.map((forecast, index) => (
        <Forecast
          date={forecast.date}
          city={forecast.City}
          conditions={forecast.conditions}
          units={units}
          remove={() => {
            remove(index);
          }}
          key={`${forecast.City.id}+${forecast.date}`}
        />
      ))}
    </div>
  );
};

export default Results;
