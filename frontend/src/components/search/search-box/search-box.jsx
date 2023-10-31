/**
 * @module SearchBox
 */
import React from 'react';
import { useIntl } from 'react-intl';
import './search-box.scss';

/**
 * JSX Component representing an input for searching.
 * @param {Object} props
 * @param {Function} props.keyPressed  Called when a relevant key is pressed.
 * @param {Function} props.inputChanged  Called when the search input changes.
 * @returns The rendered JSX Component.
 */
const SearchBox = ({ keyPressed, inputChanged }) => {
  const intl = useIntl();

  const keyPressedDown = (e) => {
    if (
      e.key === 'ArrowUp'
      || e.key === 'ArrowDown'
      || e.key === 'Enter'
    ) {
      keyPressed(e.key);
    }
  }

  const inputHasChanged = (e) => {
    inputChanged(e.target.value);
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
      onKeyUp={ () => { keyPressed(false) } }
    />
  )
}

export default SearchBox;