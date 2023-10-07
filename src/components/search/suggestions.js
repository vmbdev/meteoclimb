import React, { useEffect, useState } from 'react';
import SuggestionItem from './suggestionitem.js';
import './suggestions.scss';

const Suggestions = (props) => {
  const [visible, setVisibility] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    setVisibility(props.isLocationActive);
  }, [props.isLocationActive]);


  useEffect(() => {
    if (props.locationKeyPressed) {
      let nextActiveIndex;

      if (props.locationKeyPressed === 'ArrowUp') {
        if (activeIndex === 0) nextActiveIndex = props.suggestionList.length-1;
        else nextActiveIndex = activeIndex - 1;
      }
      
      else if (props.locationKeyPressed === 'ArrowDown')
        if (activeIndex === props.suggestionList.length-1) nextActiveIndex = 0;
        else nextActiveIndex = activeIndex + 1;
        
      setActiveIndex(nextActiveIndex);
    }
  // we don't want to re-render when activeIndex or props.suggestionList change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.locationKeyPressed]);


  const isVisible = () => {
    return `search__suggestions--${visible ? 'visible' : 'hidden'}`;
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
      className={ `search__suggestions ${isVisible()}` }
      id="search-suggestions"
    >
      { getSuggestionList() }
    </div>
  )
}

export default Suggestions;