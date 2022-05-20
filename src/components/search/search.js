import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import Location from './location.js';
import Suggestions from './suggestions.js';
import DateSelector from './dateselector.js';
import countryCodes from '../../helpers/countrycodes.js';
import './search.scss';

const Search = () => {
  const [isLocationActive, setLocationActive] = useState(false);
  const [locationKeyPressed, setLocationKeyPressed] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);
  const [suggestionList, setSuggestionList] = useState([]);
  const [dateList, setDateList] = useState([]);

  useEffect(() => {
    let list = [];
    let currentDay = DateTime.local()

    for (let i = 0; i < 7; i++) {
      list.push({
          day: currentDay.weekdayShort,
          dateOffset: i,
          active: false
        });
      currentDay = currentDay.plus({ days: 1 });
    }
    setDateList(list);
  }, []);

  const getClassName = () => {
    // FIXME temporary
    return `search ${!isCollapsed ? 'search--state-collapsed' : ''}`;
  }

  const getCityId = (cityId) => {
    setCollapsed(true);
    setLocationActive(false);
    let dates = dateList.filter((date) => date.active).map((date) => date.dateOffset).join(';');
    console.log(cityId, dates);

    fetch(`http://localhost:8080/api/forecast/${cityId}/${dates}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(e => {console.log(`error: ${e}`)});
  }

  const findCityName = (value) => {
    if (value.length >= 3) {
      // FIXME: variable endpoint
      fetch(`http://localhost:8080/api/city/search/${value}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          for (let item of data) {
            item.flag = countryCodes[item.country].flag;
            item.country = countryCodes[item.country].name;
          }
          setSuggestionList(data)
          setLocationActive(true);
        }
        else {
          setSuggestionList([])
          setLocationActive(false);
        }
      });
    }
    else
      setLocationActive(false);
  }

  return (
    <div className={ getClassName() }>
      <DateSelector updateDateList={ setDateList }>
        { dateList }
      </DateSelector>
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

export default Search;