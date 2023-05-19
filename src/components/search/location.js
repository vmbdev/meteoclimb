import React from 'react';
import { useIntl } from 'react-intl';
import './location.scss';

const Location = (props) => {
  const intl = useIntl();

  const keyPressedDown = (e) => {
    if ((e.key === 'ArrowUp') || (e.key === 'ArrowDown')) {
      props.keyPressed(e.key);
    }
  }

  const inputHasChanged = (e) => {
    props.findCityName(e.target.value)
  }

  return (
    <input
      className="search__location"
      type="text"
      placeholder={
        intl.formatMessage({
          id: 'location.placeholder',
          defaultMessage: 'City, Country (i.e. London, GB)'
        })
      }
      spellCheck="false"
      autoComplete="off"
      onChange={ inputHasChanged }
      onKeyDown={ keyPressedDown }
      onKeyUp={ () => { props.keyPressed(false) } }
    />
  )
}

export default Location;