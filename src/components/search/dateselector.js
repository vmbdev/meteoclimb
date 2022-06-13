import React from 'react';
import './dateselector.scss';

const DateSelector = (props) => {

  const updateDateList = (index) => {
    if (index >= 0 && index < props.children.length) {
      let list = [...props.children];
      list[index].active = !list[index].active;
      props.updateDateList(list)
    }
  }

  return (
    <div>
      <div className="search__datelist">
        {
          props.children.map((item, i) =>
            <div
              className={ `search__dateitem ${(item.active ? 'search__dateitem--active' : '')}` }
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