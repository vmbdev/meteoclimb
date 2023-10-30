/**
 * @module Search
 */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { DateTime } from 'luxon';
import SearchBox from './searchbox/searchbox.jsx';
import Suggestions from './suggestions/suggestions.jsx';
import DateSelector from '../dateselector/dateselector.jsx';
import { api } from '../../services/api.js';
import './search.scss';

/**
 * JSX Component that allows searching.
 * @param {Object} props
 * @param {Object} props.storedData  List of locations and dates stored from previous
 *     searches.
 * @param {Function} props.awaitSearchResults  Called when the stored data is
 *     restored.
 * @param {Function} props.setLoadingData  Called when the search starts and
 *     ends, to prevent other components from storing not fetched results.
 * @returns The rendered JSX Component.
 */
const Search = ({ storedData, awaitSearchResults, setLoadingData }) => {
  const [isSearchBoxActive, setSearchBoxActive] = useState(false);
  const [searchBoxKeyPressed, setSearchBoxKeyPressed] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);
  const [suggestionList, setSuggestionList] = useState([]);
  const [dateList, setDateList] = useState([]);
  const {locale} = useIntl();

  // create the date bar above the search box
  useEffect(() => {
    const list = [];
    let day = DateTime.local().setLocale(locale);

    for (let i = 0; i < 7; i++) {
      list.push({
        day: day.weekdayShort,
        fullDate: day.toFormat('yyyy-MM-dd'),
        selected: (i === 0)
      });
      day = day.plus({ days: 1 });
    }

    setDateList(list);
  }, [locale]);

  // if the user has previously done a search and it's in LocalStorage
  useEffect(() => {
    (async () => {
      if (storedData) {
        setLoadingData(true);
        const restoredData = [];
  
        for (const [cityId, dates] of Object.entries(storedData)) {
          const forecast = await fetchForecast(cityId, dates);
          restoredData.push(forecast);
        }

        awaitSearchResults(restoredData);
        setLoadingData(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedData]);

  const getClassName = () => {
    return `search ${isCollapsed ? 'search--collapsed' : ''}`;
  }

  const findForecast = async (cityId, dates) => {
    const forecast = await fetchForecast(cityId, dates);
    awaitSearchResults([forecast]);
  }

  const fetchForecast = async (cityId, dates) => {
    setCollapsed(true);
    setSearchBoxActive(false);

    if (!dates) {
      dates = dateList
        .filter((date) => date.selected)
        .map((date) => date.fullDate)
    }

    return api.getForecast(cityId, dates);
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
      <DateSelector setDateList={ setDateList }>
        { dateList }
      </DateSelector>
      <div className="search__nav">
        <SearchBox
          inputChanged={ findCityName }
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