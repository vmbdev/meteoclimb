import React from 'react';
import { useIntl } from 'react-intl';
import './searchbox.scss';

const SearchBox = (props) => {
  const intl = useIntl();

  const keyPressedDown = (e) => {
    if (
      e.key === 'ArrowUp'
      || e.key === 'ArrowDown'
      || e.key === 'Enter'
    ) {
      props.keyPressed(e.key);
    }
  }

  const inputHasChanged = (e) => {
    props.findCityName(e.target.value);
  }

  return (
    <input
      className="searchbox"
      type="text"
      placeholder={
        intl.formatMessage({
          id: 'searchbox.placeholder',
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

export default SearchBox;