import React from 'react';
import './location.scss';

const Location = (props) => {
  const keyPressedDown = (e) => {
    if ((e.key === 'ArrowUp') || (e.key === 'ArrowDown'))
      props.keyPressed(e.key);
  }

  const inputHasChanged = (e) => {
    props.findCityName(e.target.value)
  }

  return (
    <input
      className="search__location"
      type="text"
      placeholder="City, Country"
      spellCheck="false"
      autoComplete="off"
      onChange={ inputHasChanged }
      onKeyDown={ keyPressedDown }
      onKeyUp={ () => { props.keyPressed(false) } }
    />
  )
}

export default Location;