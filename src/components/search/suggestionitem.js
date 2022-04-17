import React from 'react';
import './suggestionitem.css';

class SuggestionsItem extends React.Component {


  render() {
    return(
      <div className="search__item" id={this.props.active ? "search-item-active" : ""}>{this.props.location}</div>
    )
  }
}

export default SuggestionsItem;