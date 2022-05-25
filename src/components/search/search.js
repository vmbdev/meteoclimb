import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import Location from './location.js';
import Suggestions from './suggestions.js';
import DateSelector from './dateselector.js';
import './search.scss';

const Search = (props) => {
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

  useEffect(() => {
    if (props.storedData) {
      props.setLoadingData(true);
      for (const [cityId, dates] of Object.entries(props.storedData)) {
        const list = dates
          .map(date => Math.abs(Math.ceil(DateTime.fromFormat(date, 'yyyy-MM-dd').toUTC().diffNow('days').days)))
          .filter(i => i > -1 && i <= 6)
          .join(';');
       
        fetchForecast(cityId, list);
      }
      props.setLoadingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.storedData]);

  const getClassName = () => {
    return `search ${isCollapsed ? 'search--collapsed' : ''}`;
  }

  const fetchForecast = (cityId, dates) => {
    console.log('call for ',cityId, dates)
    setCollapsed(true);
    setLocationActive(false);
    if (dates === undefined)
      dates = dateList.filter((date) => date.active).map((date) => date.dateOffset).join(';');

    fetch(`http://localhost:8080/api/forecast/${cityId}/${dates}`)
      .then(res => res.json())
      .then(data => { if (data) props.setResults(data); })
      .catch(e => { console.error(`Error: ${e}`) });
  }

  const findCityName = (value) => {
    if (value.length >= 3) {
      // FIXME: variable endpoint
      fetch(`http://localhost:8080/api/city/search/${value}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
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
        <Suggestions isLocationActive={ isLocationActive } locationKeyPressed={ locationKeyPressed } fetchForecast={ fetchForecast }>
          { suggestionList }
        </Suggestions>
      </div>
    </div>
  );
}

export default Search;