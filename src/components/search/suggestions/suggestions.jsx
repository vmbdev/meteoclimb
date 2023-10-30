/**
 * @module Suggestions
 */
import React, { useEffect, useState } from 'react';
import SuggestionItem from '../suggestionitem/suggestionitem.jsx';
import './suggestions.scss';

/**
 * JSX Component representing the suggested values as the search input receives
 * new text.
 * @param {Object} props
 * @param {boolean} props.isSearchBoxActive  True if the search box is focused.
 * @param {Function} props.searchBoxKeyPressed  Called when the search box has
 *     received a key input, to enable navigation with keyboard.
 * @param {Object[]} props.suggestionList  The list of suggestions for the
 *     current input
 * @param {Function} props.findForecast  Called when an item from the list is
 *     selected.
 * @returns 
 */
const Suggestions = ({
  isSearchBoxActive,
  searchBoxKeyPressed,
  suggestionList,
  findForecast
}) => {
  const [visible, setVisibility] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  
  useEffect(() => {
    setVisibility(isSearchBoxActive);
  }, [isSearchBoxActive]);


  useEffect(() => {
    if (searchBoxKeyPressed) {
      let nextActiveItem;

      switch(searchBoxKeyPressed) {
        case 'ArrowUp': {
          if (activeItem === 0) nextActiveItem = suggestionList.length-1;
          else nextActiveItem = activeItem - 1;
          
          setActiveItem(nextActiveItem);
          break;
        }
        case 'ArrowDown': {
          if (activeItem === suggestionList.length-1) nextActiveItem = 0;
          else nextActiveItem = activeItem + 1;

          setActiveItem(nextActiveItem);
          break;
        }
        case 'Enter': {
          // don't process if the suggestion list is not active
          if (visible) {
            const item = suggestionList[activeItem]

            if (item) {
              findForecast(item.id);
            }
          }
        }

      }
        
    }
  // we don't want to re-render when activeItem or suggestionList change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBoxKeyPressed]);


  const isVisible = () => {
    return `suggestions--${visible ? 'visible' : 'hidden'}`;
  }

  const getSuggestionList = () => {
    const items = [];

    for (let i = 0; i < suggestionList.length; i++) {
      items.push(
        <SuggestionItem
          key={ i }
          id={ i }
          active={ (i === activeItem) ? true : false }
          city={ suggestionList[i] }
          setActive={ setActiveItem }
          findForecast={ findForecast }
        />
      );
    }
    return items;
  }

  return (
    <div
      className={ `suggestions ${isVisible()}` }
      id="search-suggestions"
    >
      { getSuggestionList() }
    </div>
  )
}

export default Suggestions;
