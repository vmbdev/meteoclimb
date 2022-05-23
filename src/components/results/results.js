import React from 'react';
import Forecast from './forecast.js';
import './results.scss';

const Results = (props) => {
  const getClassName = () => {
    return `results ${props.results.length === 0 ? 'results--collapsed' : ''}`;
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
        props.results.map((data) =>
          <Forecast
            date={ data.date }
            city={ data.city }
            conditions={ data.conditions }
            key={ `${data.city.id}+${data.date}` }
          />
        )
      }
    </div>
  );
}

export default Results;