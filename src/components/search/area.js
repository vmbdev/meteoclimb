import React, { useState } from 'react';
import Location from './location.js';
import Suggestions from './suggestions.js';
import DateSelector from './dateselector.js';
import './area.scss';

const Area = (props) => {
  const [isLocationActive, setLocationActive] = useState(false);
  const [locationKeyPressed, setLocationKeyPressed] = useState(false);

  const getCityId = (id) => {
    console.log(id)
  }

  return (
    <div className="search">
      <DateSelector />
      <div className="search__nav">
        <Location
          setLocationActive={ setLocationActive }
          keyPressed={ setLocationKeyPressed }
        />
        <Suggestions isLocationActive={ isLocationActive } locationKeyPressed={ locationKeyPressed } getCityId={ getCityId }>
          { props.suggestions }
        </Suggestions>
      </div>
    </div>
  );
}

export default Area;