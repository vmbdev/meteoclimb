import React, { useState } from 'react';
import Location from './search/location.js';
import SearchInputDate from './search/date.js';
import Suggestions from './search/suggestions.js';
import './search.css';

const SearchArea = () => {
  const [isLocationActive, setLocationActive] = useState(false);

  const locationActive = () => {
    setLocationActive(true);
  }

  const locationInactive = () => {
    setLocationActive(false);
  }

  return (
    <div className="search" id="search">
      <div className="search__nav">
        <form className="search__form" action="" method="get" autoComplete="off">
          <Location locationActive={ locationActive } locationInactive={ locationInactive} />
          <SearchInputDate />
        </form>
      </div>
      <div className="search__options">
        <Suggestions isLocationActive={ isLocationActive }/>
        <div className="search__dates" id="search-dates"></div>
      </div>
    </div>
  );
}

export default SearchArea;