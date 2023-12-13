/**
 * @module SuggestionItem
 */
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { toDMS } from '../../../helpers/geocoords.js';
import { getCountry } from '../../../helpers/countrycodes.js';
import './suggestion-item.scss';

/**
 * JSX Component representing an item from the list of search suggestions.
 * @param {Object} props
 * @param {number} props.id  Id of the suggestion in the suggestion list.
 * @param {boolean} props.active  Whether the current item is being selected
 *     by the user.
 * @param {City} props.city  A city object for the suggestion.
 * @param {Function} props.setActive  Sets current item as active in the list.
 * @param {Function} props.findForecast  Called when the item is selected.
 * @returns The rendered JSX Component.
 */
const SuggestionItem = ({ id, active, city, setActive, findForecast }) => {
  const [country, setCountry] = useState({ flag: '', name: '' });

  const getClassName = () => {
    return `item__city ${active ? 'item__city--active' : ''}`;
  };

  useEffect(() => {
    setCountry(getCountry(city.country));
  }, [city]);

  return (
    <div
      className={getClassName()}
      data-id={city.id}
      onMouseEnter={() => {
        setActive(id);
      }}
      onClick={() => {
        findForecast(city);
      }}
    >
      <div className="item__cityname">
        <img className="item__flag" src={country.flag} alt={country.name} />
        {city.name}, {country.name}
      </div>
      <div className="item__station">
        <FormattedMessage
          id="item.station"
          defaultMessage="Station @ ({lat}, {lon})"
          values={{
            lat: toDMS(city.lat, 'lat'),
            lon: toDMS(city.lon, 'lon'),
          }}
        />
      </div>
    </div>
  );
};

export default SuggestionItem;
