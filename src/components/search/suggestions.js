import React, { useEffect, useState } from 'react';
import SuggestionsItem from './suggestionitem.js';
import './suggestions.css';

const Suggestions = (props) => {
  const [visible, setVisibility] = useState(false);

  const getClassName = () => {
    return `search__suggestions search__suggestions--state-${visible ? "visible" : "hidden"}`;
  }

  useEffect(() => {
    setVisibility(props.isLocationActive);
  }, [props.isLocationActive]);

  return(
    <div className={ getClassName() } id="search-suggestions">
      <SuggestionsItem active={true} location="Madrid, España" />
      <SuggestionsItem location="London, United Kingdom" />
      <SuggestionsItem location="Osaka, Japan" />
    </div>
  )
}

export default Suggestions;