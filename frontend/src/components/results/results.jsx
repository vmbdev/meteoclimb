/**
 * @module Results
 */
import React, { useEffect, useState } from 'react';
import Forecast from '../forecast/forecast.jsx';
import './results.scss';

/**
 * JSX Component displaying the results of a weather search.
 * @param {Object} props
 * @param {Object[]} props.searchResults  The results to be displayed.
 * @param {Function} props.save  A function to store the results somewhere
 *    (i.e. local storage).
 * @returns The rendered JSX component.
 */
const Results = ({ searchResults, save }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setResults(searchResults.concat(results));
    }
  }, [searchResults]);

  useEffect(() => {
    if (results && results.length > 0) {
      const storableResults = {};

      for (let item of results) {
        const id = item.City.id;

        if (!storableResults[id]) storableResults[id] = [];

        storableResults[id].push(item.date);
      }
      save(storableResults);
    }
  }, [results]);

  /**
   * Removes an object from the results.
   * @param {number} index  The index of the object to be removed.
   */
  const remove = (index) => {
    const newResults = [...results];

    newResults.splice(index, 1);
    setResults(newResults);
    
    if (newResults.length === 0) save([]);
  }

  /**
   * Function to scroll the results horizontally.
   * @param {Event} event  The event triggering the function (i.e. onWheel)
   */
  const scrollResults = (event) => {
    let amount;

    if (event.deltaY > 0) amount = 100;
    else amount = -100;

    event.currentTarget.scrollBy(amount, 0);
  }

  return (
    <div className="">
      <div className={ `results__list ${results.length === 0 ? 'results--collapsed' : ''}` } onWheel={ scrollResults }>
      {
        results.map((forecast, index) =>
          <Forecast
            date={ forecast.date }
            city={ forecast.City }
            conditions={ forecast.conditions }
            remove={ () => { remove(index) } }
            key={ `${forecast.City.id}+${forecast.date}` }
          />
        )
      }
      </div>
    </div>
  );
}

export default Results;