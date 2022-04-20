import React, { useState } from 'react';
import Location from './search/location.js';
import Suggestions from './search/suggestions.js';
import DateSelector from './search/dateselector.js';
import './searcharea.scss';

const SearchArea = () => {
  const [isLocationActive, setLocationActive] = useState(false);
  const [locationKeyPressed, setLocationKeyPressed] = useState(false);

  const locationActive = () => {
    setLocationActive(true);
  }

  const locationInactive = () => {
    setLocationActive(false);
  }

  return (
    <div className="search">
      <div className="search__nav">
        <Location
          locationActive={ locationActive }
          locationInactive={ locationInactive }
          keyPressed={ setLocationKeyPressed }
        />
        <Suggestions isLocationActive={ isLocationActive } locationKeyPressed={ locationKeyPressed } />
      </div>
      <DateSelector />
    </div>
  );
}

export default SearchArea;