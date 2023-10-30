/**
 * @module ThemeSwitcher
 */
import React from 'react';
import './themeswitcher.scss';

/**
 * JSX Component that allows switching the theme.
 * @param {Object} props
 * @param {Function} props.switchTheme  Toggles the current active theme.
 * @param {string} props.theme  The current active theme.
 * @returns The rendered. JSX Component.
 */
const ThemeSwitcher = ({ switchTheme, theme }) => {

  return (
    <div className="themeswitcher">
      <div className="button r toggleswitch">
        <input
          type="checkbox"
          className="checkbox"
          onChange={ switchTheme }
          checked={ theme === 'light' }
        />
        <div className="knobs"></div>
        <div className="layer"></div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;