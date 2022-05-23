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
    if (props.locationKeyPressed !== false) {
      let nextActiveIndex;

      if (props.locationKeyPressed === 'ArrowUp')
        nextActiveIndex = (activeIndex === 0) ? props.children.length-1 : activeIndex - 1;
      
      else if (props.locationKeyPressed === 'ArrowDown')
        nextActiveIndex = (activeIndex === props.children.length-1) ? 0 : activeIndex + 1;
        
      setActiveIndex(nextActiveIndex);
    }
  // we don't want to re-render when activeIndex or props.children are updated
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.locationKeyPressed]);


  const getClassName = () => {
    return `search__suggestions search__suggestions--${visible ? 'visible' : 'hidden'}`;
  }

  const getSuggestionList = () => {
    let items = [];
    for (let i = 0; i < props.children.length; i++) {
      items.push(
        <SuggestionItem
          key={ i }
          id={ i }
          active={ (i === activeIndex) ? true : false }
          city={ props.children[i] }
          setActiveIndex={ setActiveIndex }
          fetchForecast={ props.fetchForecast }
        />
      );
    }
    return items;
  }

  return (
    <div className={ getClassName() } id="search-suggestions">{ getSuggestionList() }</div>
  )
}

export default Suggestions;