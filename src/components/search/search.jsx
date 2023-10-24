import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { DateTime } from 'luxon';
import SearchBox from './searchbox/searchbox.jsx';
import Suggestions from './suggestions/suggestions.jsx';
import DateSelector from '../dateselector/dateselector.jsx';
import { api } from '../../services/api.js';
import './search.scss';

const Search = (props) => {
  const [isSearchBoxActive, setSearchBoxActive] = useState(false);
  const [searchBoxKeyPressed, setSearchBoxKeyPressed] = useState(false);
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
            const diff = (
              DateTime.fromFormat(date, 'yyyy-MM-dd')
                .toUTC()
                .diffNow('days')
                .days
            );

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
    setSearchBoxActive(false);

    if (!dates) {
      dates = dateList
        .filter((date) => date.active)
        .map((date) => date.dateOffset)
        .join(';');
    }

    const data = await api.getForecast(cityId, dates);

    return data;
  }

  const findCityName = async (cityName) => {
    if (cityName.length >= 3) {
      const cities = await api.getCities(cityName);

      if (cities.length > 0) {
        setSuggestionList(cities)
        setSearchBoxActive(true);
      }
      else {
        setSuggestionList([])
        setSearchBoxActive(false);
      }
    }
    else setSearchBoxActive(false);
  }

  return (
    <div className={ getClassName() }>
      <DateSelector updateDateList={ setDateList }>
        { dateList }
      </DateSelector>
      <div className="search__nav">
        <SearchBox
          findCityName={ findCityName }
          keyPressed={ setSearchBoxKeyPressed }
        />
        <Suggestions
          isSearchBoxActive={ isSearchBoxActive }
          searchBoxKeyPressed={ searchBoxKeyPressed }
          findForecast={ findForecast }
          suggestionList={ suggestionList }
        />
      </div>
    </div>
  );
}

export default Search;