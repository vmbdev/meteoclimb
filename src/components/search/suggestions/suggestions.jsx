import React, { useEffect, useState } from 'react';
import SuggestionItem from '../suggestionitem/suggestionitem.jsx';
import './suggestions.scss';

const Suggestions = (props) => {
  const [visible, setVisibility] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    setVisibility(props.isSearchBoxActive);
  }, [props.isSearchBoxActive]);


  useEffect(() => {
    if (props.searchBoxKeyPressed) {
      let nextActiveIndex;

      switch(props.searchBoxKeyPressed) {
        case 'ArrowUp': {
          if (activeIndex === 0) nextActiveIndex = props.suggestionList.length-1;
          else nextActiveIndex = activeIndex - 1;
          
          setActiveIndex(nextActiveIndex);
          break;
        }
        case 'ArrowDown': {
          if (activeIndex === props.suggestionList.length-1) nextActiveIndex = 0;
          else nextActiveIndex = activeIndex + 1;

          setActiveIndex(nextActiveIndex);
          break;
        }
        case 'Enter': {
          // don't process if the suggestion list is not active
          if (visible) {
            const item = props.suggestionList[activeIndex]

            if (item) {
              props.findForecast(item.id);
            }
          }
        }

      }
        
    }
  // we don't want to re-render when activeIndex or props.suggestionList change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.searchBoxKeyPressed]);


  const isVisible = () => {
    return `suggestions--${visible ? 'visible' : 'hidden'}`;
  }

  const getSuggestionList = () => {
    const items = [];

    for (let i = 0; i < props.suggestionList.length; i++) {
      items.push(
        <SuggestionItem
          key={ i }
          id={ i }
          active={ (i === activeIndex) ? true : false }
          city={ props.suggestionList[i] }
          setActiveIndex={ setActiveIndex }
          findForecast={ props.findForecast }
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