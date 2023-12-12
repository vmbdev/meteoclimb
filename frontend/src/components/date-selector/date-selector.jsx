/**
 * @module DateSelector
 */
import React from 'react';
import './date-selector.scss';

/**
 * JSX Component representing a selector for a list of seven days starting the
 * current day.
 * @param {Object} props
 * @param {Object[]} props.children
 * @param {Function} props.setDateList  Function called with the list of dates.
 * @returns The rendered JSX Component.
 */
const DateSelector = ({ children, setDateList }) => {
  /**
   * Toggles a date value between active and inactive
   * @function
   * @param {*} index
   */
  const toggleDate = (index) => {
    if (index >= 0 && index < children.length) {
      const list = [...children];

      list[index].selected = !list[index].selected;
      setDateList(list);
    }
  };

  const getSelectedClass = (item) => {
    return `${item.selected ? 'dateitem--selected' : ''}`;
  };

  return (
    <div>
      <div className="datelist">
        {children.map((item, i) => (
          <div
            className={`dateitem ${getSelectedClass(item)}`}
            key={item.day}
            data-dateoffset={item.dateOffset}
            onClick={() => {
              toggleDate(i);
            }}
          >
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;
