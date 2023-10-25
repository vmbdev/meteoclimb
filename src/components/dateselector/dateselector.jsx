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
    return `${(item.active ? 'dateitem--active' : '')}`
  }

  return (
    <div>
      <div className="datelist">
        {
          props.children.map((item, i) =>
            <div
              className={ `dateitem ${isActive(item)}` }
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