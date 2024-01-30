import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import SearchInput from './search-input/search-input.jsx';
import WeatherStationList from './weather-station-list/weather-station-list.jsx';
import DateSelector from '../date-selector/date-selector.jsx';

import { dateListGen } from '../../helpers/datelistgen.js';
import { api } from '../../services/api.js';
import { toaster } from '../../services/toaster.js';

import './search-box.scss';

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
  const [isSearchInputActive, setSearchInputActive] = useState(false);
  const [searchInputKeyPressed, setSearchInputKeyPressed] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);
  const [weatherStationList, setWeatherStationList] = useState([]);
  const [dateList, setDateList] = useState([]);
  const intl = useIntl();

  // populate the date selector above the search box
  useEffect(() => {
    setDateList(dateListGen(7, intl.locale));
  }, [intl.locale]);

  // if the user has previously done a search and it's in LocalStorage
  useEffect(() => {
    (async () => {
      if (storedData) {
        setLoadingData(true);
  
        for (const [cityId, dates] of Object.entries(storedData)) {
          const city = await api.getCity(cityId);
          const forecast = fetchForecast(cityId, dates);

          awaitSearchResults(city, forecast);
        }

        setLoadingData(false);
      }
    })();
  }, [storedData]);

  /**
   * Fetches the weather forecast for the location and dates given and provides
   * them to the parent component through awaitSearchResults().
   * @param {number} cityId The ID of the location.
   * @param {Object} dates The days of the requested weather forecast.
   */
  const findForecast = (city, dates) => {
    const forecast = fetchForecast(city.id, dates);

    awaitSearchResults(city, forecast);
  };

  /**
   * Fetches the weather forecast for the location and dates given.
   * @param {number} cityId  The ID of the location.
   * @param {Object} dates  The days of the requested weather forecast.
   * @returns {Promise<Forecast>}  A promise containing the forecast.
   */
  const fetchForecast = async (cityId, dates) => {
    setCollapsed(true);
    setSearchInputActive(false);

    if (!dates) {
      dates = dateList
        .filter((date) => date.selected)
        .map((date) => date.fullDate);
    }

    return api.getForecast(cityId, dates);
  };

  const fetchCitiesByName = async (cityName) => {
    if (cityName.length >= 3) {
      try {
        const cities = await api.getCities(cityName);

        if (cities.length > 0) {
          setWeatherStationList(cities);
          setSearchInputActive(true);
        } else {
          setWeatherStationList([]);
          setSearchInputActive(false);
        }
      } catch (err) {
        toaster.error(
          intl.formatMessage({
            id: 'search.error.city',
            defaultMessage: 'Error getting the suggestions.',
          }),
          'city-error'
        );
      }
    } else setSearchInputActive(false);
  };

  const getCollapsedClassName = () => {
    return isCollapsed ? 'search--collapsed' : '';
  };

  return (
    <section className={`search ${getCollapsedClassName()}`}>
      <DateSelector setDateList={setDateList} dates={dateList} />
      <div className="search__nav">
        <SearchInput
          inputChanged={fetchCitiesByName}
          keyPressed={setSearchInputKeyPressed}
        />
        <WeatherStationList
          isSearchInputActive={isSearchInputActive}
          searchInputKeyPressed={searchInputKeyPressed}
          findForecast={findForecast}
          list={weatherStationList}
        />
      </div>
    </section>
  );
};

Search.propTypes = {
  storedData: PropTypes.object,
  awaitSearchResults: PropTypes.func,
  setLoadingData: PropTypes.func,
}

export default Search;
