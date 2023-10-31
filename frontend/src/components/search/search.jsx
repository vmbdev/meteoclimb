/**
 * @module Search
 */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { DateTime } from 'luxon';

import SearchBox from './search-box/search-box.jsx';
import SuggestionList from './suggestion-list/suggestion-list.jsx';
import DateSelector from '../date-selector/date-selector.jsx';

import { api } from '../../services/api.js';
import { toaster } from '../../services/toaster.js';

import './search.scss';

/**
 * JSX Component that allows searching.
 * @param {Object} props
 * @param {Object} props.storedData  List of locations and dates stored from
 *     previous searches.
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

  // populate the date selector above the search box
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
    if (storedData) {
      setLoadingData(true);
      const restoredData = [];

      for (const [cityId, dates] of Object.entries(storedData)) {
        const forecast = fetchForecast(cityId, dates);
        restoredData.push(forecast);
      }

      awaitSearchResults(restoredData);
      setLoadingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedData]);

  /**
   * Fetches the weather forecast for the location and dates given and provides
   * them to the parent component through awaitSearchResults().
   * @param {number} cityId  The ID of the location.
   * @param {Object} dates  The days of the requested weather forecast.
   */
  const findForecast = (cityId, dates) => {
    const forecast = fetchForecast(cityId, dates);

    awaitSearchResults([forecast]);
  }

  /**
   * Fetches the weather forecast for the location and dates given.
   * @param {number} cityId  The ID of the location.
   * @param {Object} dates  The days of the requested weather forecast.
   * @returns {Promise<Forecast>}  A promise containing the forecast.
   */
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

  const fetchCitiesByName = async (cityName) => {
    if (cityName.length >= 3) {
      try {
        const cities = await api.getCities(cityName);

        if (cities.length > 0) {
          setSuggestionList(cities)
          setSearchBoxActive(true);
        }
        else {
          setSuggestionList([])
          setSearchBoxActive(false);
        }
      } catch (err) {
        toaster.error('Error getting the suggestions.', 'city-error');
      }
    }
    else setSearchBoxActive(false);
  }

  const getCollapsedClassName = () => {
    return isCollapsed ? 'search--collapsed' : '';
  }

  return (
    <div className={ `search ${getCollapsedClassName()}` }>
      <DateSelector setDateList={ setDateList }>
        { dateList }
      </DateSelector>
      <div className="search__nav">
        <SearchBox
          inputChanged={ fetchCitiesByName }
          keyPressed={ setSearchBoxKeyPressed }
        />
        <SuggestionList
          isSearchBoxActive={ isSearchBoxActive }
          searchBoxKeyPressed={ searchBoxKeyPressed }
          findForecast={ findForecast }
          list={ suggestionList }
        />
      </div>
    </div>
  );
}

export default Search;