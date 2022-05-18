import React, { useState } from 'react';
import Location from './location.js';
import Suggestions from './suggestions.js';
import DateSelector from './dateselector.js';
import countryCodes from '../../helpers/countrycodes.js';
import './area.scss';

const Area = () => {
  const [isLocationActive, setLocationActive] = useState(false);
  const [locationKeyPressed, setLocationKeyPressed] = useState(false);
  const [suggestionList, setSuggestionList] = useState([]);

  const getCityId = (id) => {
    console.log(id)
  }

  const findCityName = (value) => {
    if (value.length >= 3) {
      // FIX: variable endpoint
      fetch(`http://localhost:8080/api/city/search/${value}`)
      .then(res => res.json())
      .then(data => {
        for (let item of data) {
          item.flag = countryCodes[item.country].flag;
          item.country = countryCodes[item.country].name;
        }
        setSuggestionList(data)
        setLocationActive(true);
      });
    }
    else
      setLocationActive(false);
  }

  return (
    <div className="search">
      <DateSelector />
      <div className="search__nav">
        <Location
          findCityName={ findCityName }
          keyPressed={ setLocationKeyPressed }
        />
        <Suggestions isLocationActive={ isLocationActive } locationKeyPressed={ locationKeyPressed } getCityId={ getCityId }>
          { suggestionList }
        </Suggestions>
      </div>
    </div>
  );
}

export default Area;