import React, { useEffect, useState } from 'react';
import Forecast from './forecast.js';
import './results.scss';

const Results = (props) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (props.results && props.results.length > 0) {
      setResults(props.results.concat(results));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.results]);

  useEffect(() => {
    if (results && results.length > 0) {
      let storableResults = {};
      for (let item of results) {
        let id = item.city.id;
        if (!storableResults[id]) storableResults[id] = [];
        storableResults[id].push(item.date);
      }
      props.save(storableResults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  const remove = (index) => {
    let newResults = [...results];
    newResults.splice(index, 1);
    setResults(newResults);
    
    if (newResults.length === 0)
      props.save([]);
  }

  const getClassName = () => {
    return `results ${results.length === 0 ? 'results--collapsed' : ''}`;
  }

  const scrollResults = (event) => {
    let amount;
    if (event.deltaY > 0) amount = 100;
    else amount = -100;

    event.currentTarget.scrollBy(amount, 0);
  }

  return (
    <div className={ getClassName() } onWheel={ scrollResults }>
      {
        results.map((data, index) =>
          <Forecast
            index={ index }
            date={ data.date }
            city={ data.city }
            conditions={ data.conditions }
            remove={ remove }
            key={ `${data.city.id}+${data.date}` }
          />
        )
      }
    </div>
  );
}

export default Results;