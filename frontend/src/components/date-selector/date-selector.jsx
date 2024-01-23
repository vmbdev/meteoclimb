import React from 'react';

import './date-selector.scss';

/**
 * JSX Component representing a selector for a list of seven days starting the
 * current day.
 * @param {Object} props
 * @param {Object[]} props.dates  Array containing the list of dates to show.
 * @param {Function} props.setDateList  Function called with the list of dates.
 * @returns The rendered JSX Component.
 */
const DateSelector = ({ dates, setDateList }) => {
  /**
   * Toggles a date value between active and inactive
   * @function
   * @param {*} index
   */
  const toggleDate = (index) => {
    if (index >= 0 && index < dates.length) {
      const list = [...dates];

      list[index].selected = !list[index].selected;
      setDateList(list);
    }
  };

  const getSelectedClass = (item) => {
    return `${item.selected ? 'dateitem--selected' : ''}`;
  };

  return (
    <article className="datelist">
      {dates.map((item, i) => (
        <div
          className={`dateitem ${getSelectedClass(item)}`}
          key={item.day}
          data-dateoffset={item.dateOffset}
          onClick={() => {
            toggleDate(i);
          }}
        >
          <span>{item.day}</span>
        </div>
      ))}
    </article>
  );
};

export default DateSelector;
