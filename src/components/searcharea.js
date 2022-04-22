import React, { useState } from 'react';
import Location from './search/location.js';
import Suggestions from './search/suggestions.js';
import DateSelector from './search/dateselector.js';
import './searcharea.scss';

const SearchArea = () => {
  const [isLocationActive, setLocationActive] = useState(false);
  const [locationKeyPressed, setLocationKeyPressed] = useState(false);

  const getCityId = (id) => {
    console.log(id)
  }

  return (
    <div className="search">
      <div className="search__nav">
        <Location
          setLocationActive={ setLocationActive }
          keyPressed={ setLocationKeyPressed }
        />
        <Suggestions isLocationActive={ isLocationActive } locationKeyPressed={ locationKeyPressed } getCityId={ getCityId } />
      </div>
      <DateSelector />
    </div>
  );
}

export default SearchArea;