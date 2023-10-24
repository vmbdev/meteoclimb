import React from 'react';
import './themeswitcher.scss';

const ThemeSwitcher = (props) => {

  return (
    <div className="themeswitcher">
      <div className="button r toggleswitch">
        <input
          type="checkbox"
          className="checkbox"
          onChange={ props.switchTheme }
          checked={ props.theme === 'light'}
        />
        <div className="knobs"></div>
        <div className="layer"></div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;