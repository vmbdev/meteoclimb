import React from 'react';
import './dateselector.scss';

const DateSelector = (props) => {

  const updateDateList = (index) => {
    if (index >= 0 && index < props.children.length) {
      const list = [...props.children];

      list[index].active = !list[index].active;
      props.updateDateList(list)
    }
  }

  const isActive = (item) => {
    return `${(item.active ? 'search__dateitem--active' : '')}`
  }

  return (
    <div>
      <div className="search__datelist">
        {
          props.children.map((item, i) =>
            <div
              className={ `search__dateitem ${isActive(item)}` }
              key={ item.day }
              data-dateoffset={ item.dateOffset }
              onClick={ () => { updateDateList(i) }}
            >
              { item.day }
            </div>
          )
        }
      </div>
    </div>
  );
}

export default DateSelector;