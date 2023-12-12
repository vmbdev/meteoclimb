import React from 'react';
import './button-group.scss';

const ButtonGroup = ({ buttons, selected, onChange, showText = true }) => {
  const getButtons = () => {
    return buttons.map(({ icon, text, val }) => (
      <button
        className={`button-group__item ${isActiveClass(val)}`}
        key={val}
        onClick={() => {
          onChange(val);
        }}
      >
        {icon && <img className="button-group__icon" src={icon} alt={text} />}
        {icon && text && showText && <div className="button-group__divider"></div>}
        {showText && text && <span className="button-group__text">{text}</span>}
      </button>
    ));
  };

  const isActiveClass = (val) => {
    return `${selected === val ? 'button-group__item--active' : ''}`;
  };

  return (
    <div className="button-group">
      {getButtons()}
    </div>
  );
};

export default ButtonGroup;
