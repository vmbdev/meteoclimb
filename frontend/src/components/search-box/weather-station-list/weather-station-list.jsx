import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import WeatherStation from '../weather-station/weather-station.jsx';
import './weather-station-list.scss';

/**
 * JSX Component representing the weather stations as the search input receives
 * new text.
 * @param {Object} props
 * @param {boolean} props.isSearchInputActive  True if the search box is focused.
 * @param {Function} props.searchInputKeyPressed  Called when the search box has
 *     received a key input, to enable navigation with keyboard.
 * @param {Object[]} props.list  The list of suggestions for the current input.
 * @param {Function} props.findForecast  Called when an item from the list is
 *     selected.
 * @returns The rendered JSX Component.
 */
const SuggestionList = ({
  isSearchInputActive,
  searchInputKeyPressed,
  list,
  findForecast,
}) => {
  const [visible, setVisibility] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    setVisibility(isSearchInputActive);
  }, [isSearchInputActive]);

  useEffect(() => {
    if (searchInputKeyPressed) {
      let nextActiveItem;

      switch (searchInputKeyPressed) {
        case 'ArrowUp': {
          if (activeItem === 0) nextActiveItem = list.length - 1;
          else nextActiveItem = activeItem - 1;

          setActiveItem(nextActiveItem);
          break;
        }
        case 'ArrowDown': {
          if (activeItem === list.length - 1) nextActiveItem = 0;
          else nextActiveItem = activeItem + 1;

          setActiveItem(nextActiveItem);
          break;
        }
        case 'Enter': {
          // don't process if the suggestion list is not active
          if (!visible) break;

          const item = list[activeItem];

          if (item) findForecast(item);

          break;
        }
      }
    }
  }, [searchInputKeyPressed]);

  const isVisible = () => {
    return `suggestions--${visible ? 'visible' : 'hidden'}`;
  };

  const getList = () => {
    const items = [];

    for (let i = 0; i < list.length; i++) {
      items.push(
        <li key={i}>
          <WeatherStation
            id={i}
            active={i === activeItem ? true : false}
            city={list[i]}
            setActive={setActiveItem}
            findForecast={findForecast}
          />
        </li>
      );
    }
    return items;
  };

  return (
    <ul className={`suggestions ${isVisible()}`} id="search-suggestions">
      {getList()}
    </ul>
  );
};

SuggestionList.propTypes = {
  isSearchInputActive: PropTypes.bool,
  searchInputKeyPressed: PropTypes.bool,
  list: PropTypes.array,
  findForecast: PropTypes.func,
}

export default SuggestionList;
