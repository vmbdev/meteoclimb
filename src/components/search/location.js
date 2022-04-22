import React from 'react';
import './location.scss';

const Location = (props) => {
  const keyPressedDown = (e) => {
    if ((e.key === 'ArrowUp') || (e.key === 'ArrowDown'))
      props.keyPressed(e.key);
  }

  const inputHasChanged = (e) => {
    props.setLocationActive(e.target.value.length >= 3);
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