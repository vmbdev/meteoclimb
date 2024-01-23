import React from 'react';

import './button-group.scss';

/**
 * @param {Object} props
 * @param {Object[]} props.buttons Buttons containing icon, text and values.
 * @param {any} props.selected The value that will be selected.
 * @param {Function} props.onChange Function called when the selection is
 *   changed.
 * @param {boolean} props.showText Whether to show the thext below
 *   (default: true)
 * @returns The rendered JSX Component.
 */
const ButtonGroup = ({ buttons, selected, onChange, showText = true }) => {
  const getButtons = () => {
    return buttons.map(({ icon, text, val }) => (
      <button
        data-testid={`buttongroup-item-${val}${
          selected === val ? '-active' : ''
        }`}
        className={`button-group__item ${isActiveClass(val)}`}
        key={val}
        onClick={() => {
          onChange(val);
        }}
      >
        {icon && <img className="button-group__icon" src={icon} alt={text} />}
        {icon && text && showText && (
          <div className="button-group__divider"></div>
        )}
        {showText && text && <span className="button-group__text">{text}</span>}
      </button>
    ));
  };

  const isActiveClass = (val) => {
    return `${selected === val ? 'button-group__item--active' : ''}`;
  };

  return <article className="button-group">{getButtons()}</article>;
};

export default ButtonGroup;
