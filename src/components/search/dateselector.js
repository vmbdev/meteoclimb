import React from 'react';
import './dateselector.scss';

const DateSelector = () => {

  const getDateList = () => {
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let list = [];
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      list.push({ day: days[today.getDay()], timestamp: today.getTime() });
      today.setDate(today.getDate()+1);
    }

    return list;
  }

  return(
    <div>
      <div className="search__datelist">
        { getDateList().map(item => <div className="search__dateitem" data-timestamp={ item.timestamp }>{ item.day }</div>) }
      </div>
    </div>
  );
}

export default DateSelector;