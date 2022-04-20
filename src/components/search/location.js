import React from 'react';
import './location.scss';

const Location = (props) => {
  const keyPressedDown = (e) => {
    if ((e.key === 'ArrowUp') || (e.key === 'ArrowDown'))
      props.keyPressed(e.key);
  }

  return(
    <input
      className="search__location"
      type="text"
      placeholder="City, Country"
      spellCheck="false"
      autoComplete="off"
      onClick={ props.locationActive }
      onBlur={ props.locationInactive }
      onKeyDown={ keyPressedDown }
      onKeyUp={ () => { props.keyPressed(false) } }
    />
  )
}

export default Location;