import React from 'react';

const Location = (props) => {
  return(
    <input className="search__location" id="search-location" type="text" placeholder="City, Country" spellCheck="false" onClick={ props.locationActive } onBlur={ props.locationInactive } />
  )
}

export default Location;