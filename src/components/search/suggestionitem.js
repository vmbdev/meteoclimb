import React from 'react';
import { toDMS } from '../../helpers/geocoords.js';
import './suggestionitem.scss';

const SuggestionItem = (props) => {
  const getClassName = () => {
    return `search__city ${(props.active ? 'search__city--state-active' : '')}`;
  }

  return (
    <div
      className={ getClassName() }
      data-id={ props.city.id }
      onMouseEnter={ () => { props.setActiveIndex(props.id) } }
      onClick={ () => { props.getCityId(props.city.id) } }
    >
      <div className="search__cityname">
        <img className="search__flag" src={ props.city.flag } alt={ props.city.country } /> { props.city.name }, { props.city.country }
      </div>
      <div className="search__station">
        Station @ ({ toDMS(props.city.lat, 'lat') }, { toDMS(props.city.lon, 'lon') })
      </div>
    </div>
  );
}

export default SuggestionItem;