import React from 'react';
import './suggestionitem.scss';

const SuggestionItem = (props) => {

  const getClassName = () => {
    return `search__item ${(props.active ? "search__item--state-active" : "")}`;
  }

  return(
    <div className={ getClassName() } data-id={ props.id } onMouseEnter={ () => props.setActiveIndex(props.id) }>
      { props.location }
    </div>
  );
}

export default SuggestionItem;