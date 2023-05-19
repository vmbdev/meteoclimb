import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
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
  const {locale} = useIntl();

  useEffect(() => {
    const list = [];
    let currentDay = DateTime.local().setLocale(locale);

    for (let i = 0; i < 7; i++) {
      list.push({
          day: currentDay.weekdayShort,
          dateOffset: i,
          active: false
        });
      currentDay = currentDay.plus({ days: 1 });
    }

    list[0].active = true;
    setDateList(list);
  }, [locale]);

  useEffect(() => {
    if (props.storedData) {
      props.setLoadingData(true);
      const restoredData = [];

      for (const [cityId, dates] of Object.entries(props.storedData)) {
        const list = dates
          .map(date => {
            const diff = DateTime.fromFormat(date, 'yyyy-MM-dd').toUTC().diffNow('days').days;

            return Math.abs(Math.ceil(diff));
          })
          .filter(i => (i > -1) && (i <= 6))
          .join(';');
       
        const forecast = fetchForecast(cityId, list);
        restoredData.push(forecast);
      }
      props.awaitSearchResults(restoredData);
      props.setLoadingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.storedData]);

  const getClassName = () => {
    return `search ${isCollapsed ? 'search--collapsed' : ''}`;
  }

  const findForecast = async (cityId, dates) => {
    const forecast = fetchForecast(cityId, dates);
    props.awaitSearchResults([forecast]);
  }

  const fetchForecast = async (cityId, dates) => {
    setCollapsed(true);
    setLocationActive(false);

    if (!dates) {
      dates = dateList
        .filter((date) => date.active)
        .map((date) => date.dateOffset)
        .join(';');
    }

    const res = await fetch(`${props.endpoint}/forecast/${cityId}/${dates}`);
    const data = await res.json();

    return data;
  }

  const findCityName = (cityName) => {
    if (cityName.length >= 3) {
      fetch(`${props.endpoint}/city/search/${cityName}`)
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
    else setLocationActive(false);
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
        <Suggestions
          isLocationActive={ isLocationActive }
          locationKeyPressed={ locationKeyPressed }
          findForecast={ findForecast }
          suggestionList={ suggestionList }
        />
      </div>
    </div>
  );
}

export default Search;