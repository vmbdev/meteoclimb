import React, { useRef, useEffect, useState } from 'react';
import SuggestionItem from './suggestionitem.js';
import './suggestions.scss';

const Suggestions = (props) => {
  const [visible, setVisibility] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const suggestions = useRef([]);;

  useEffect(() => {
    suggestions.current = [
      { id: 5, city: "Madrid, España" },
      { id: 12, city: "London, United Kingdom" },
      { id: 25, city: "Osaka, Japan" }
    ];
  }, []);
  
  
  useEffect(() => {
    setVisibility(props.isLocationActive);
  }, [props.isLocationActive]);

  //FIXME: useCallback()
  useEffect(() => {
    if (props.locationKeyPressed !== false) {
      let nextActiveIndex;

      if (props.locationKeyPressed === 'ArrowUp')
        nextActiveIndex = (activeIndex === 0) ? suggestions.current.length-1 : activeIndex - 1;
      
      else if (props.locationKeyPressed === 'ArrowDown')
        nextActiveIndex = (activeIndex === suggestions.current.length-1) ? 0 : activeIndex + 1;
        
      setActiveIndex(nextActiveIndex);
    }
  }, [props.locationKeyPressed]);


  const getClassName = () => {
    return `search__suggestions search__suggestions--state-${visible ? "visible" : "hidden"}`;
  }

  const getSuggestionList = () => {
    let items = [];
    for (let i = 0; i < suggestions.current.length; i++) {
      items.push(
        <SuggestionItem
          key={ i }
          id={ i }
          active={ (i === activeIndex) ? true : false }
          data-id={ suggestions.current[i].id }
          location={ suggestions.current[i].city }
          setActiveIndex={ setActiveIndex }
        />
      );
    }
    return items;
  }


  return(
    <div className={ getClassName() } id="search-suggestions">
      { getSuggestionList() }
    </div>
  )
}

export default Suggestions;