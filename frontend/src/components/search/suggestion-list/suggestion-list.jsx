/**
 * @module SuggestionList
 */
import React, { useEffect, useState } from 'react';
import SuggestionItem from '../suggestion-item/suggestion-item.jsx';
import './suggestion-list.scss';

/**
 * JSX Component representing the suggested values as the search input receives
 * new text.
 * @param {Object} props
 * @param {boolean} props.isSearchBoxActive  True if the search box is focused.
 * @param {Function} props.searchBoxKeyPressed  Called when the search box has
 *     received a key input, to enable navigation with keyboard.
 * @param {Object[]} props.list  The list of suggestions for the current input.
 * @param {Function} props.findForecast  Called when an item from the list is
 *     selected.
 * @returns The rendered JSX Component.
 */
const SuggestionList = ({
  isSearchBoxActive,
  searchBoxKeyPressed,
  list,
  findForecast,
}) => {
  const [visible, setVisibility] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    setVisibility(isSearchBoxActive);
  }, [isSearchBoxActive]);

  useEffect(() => {
    if (searchBoxKeyPressed) {
      let nextActiveItem;

      switch (searchBoxKeyPressed) {
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

          if (item) findForecast(item.id);

          break;
        }
      }
    }
    // we don't want to re-render when activeItem or list change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBoxKeyPressed]);

  const isVisible = () => {
    return `suggestions--${visible ? 'visible' : 'hidden'}`;
  };

  const getList = () => {
    const items = [];

    for (let i = 0; i < list.length; i++) {
      items.push(
        <SuggestionItem
          key={i}
          id={i}
          active={i === activeItem ? true : false}
          city={list[i]}
          setActive={setActiveItem}
          findForecast={findForecast}
        />
      );
    }
    return items;
  };

  return (
    <div className={`suggestions ${isVisible()}`} id="search-suggestions">
      {getList()}
    </div>
  );
};

export default SuggestionList;
