import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { toDMS } from '../../../helpers/geocoords.js';
import { getCountry } from '../../../helpers/countrycodes.js';
import './suggestionitem.scss';

const SuggestionItem = (props) => {
  const [country, setCountry] = useState({ flag: '', name: '' });

  const getClassName = () => {
    return `item__city ${(props.active ? 'item__city--active' : '')}`;
  }

  useEffect(() => {
    setCountry(getCountry(props.city.country));
  }, [props.city])

  return (
    <div
      className={ getClassName() }
      data-id={ props.city.id }
      onMouseEnter={ () => { props.setActiveIndex(props.id) } }
      onClick={ () => { props.findForecast(props.city.id) } }
    >
      <div className="item__cityname">
        <img
          className="item__flag"
          src={ country.flag }
          alt={ country.name }
        />
        { props.city.name }, { country.name }
      </div>
      <div className="item__station">
        <FormattedMessage 
          id="item.station"
          defaultMessage="Station @ ({lat}, {lon})"
          values={{
            lat: toDMS(props.city.lat, 'lat'),
            lon: toDMS(props.city.lon, 'lon')
          }}
        />
      </div>
    </div>
  );
}

export default SuggestionItem;