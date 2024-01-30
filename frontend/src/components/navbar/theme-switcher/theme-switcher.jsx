import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { toaster } from '../../../services/toaster';
import './theme-switcher.scss';

/**
 * JSX Component that allows switching the theme.
 * @param {Object} props
 * @param {Function} props.switchTheme  Toggles the current active theme.
 * @param {string} props.theme  The current active theme.
 * @returns The rendered JSX Component.
 */
const ThemeSwitcher = ({ switchTheme, theme }) => {
  useEffect(() => {
    toaster.setTheme(theme);
  }, [theme]);

  return (
    <article className={`theme-switcher theme-switcher--${theme}`}>
      <label>
        <input
          type="checkbox"
          className="theme-switcher__checkbox"
          onChange={switchTheme}
          checked={theme === 'light'}
        />
        <FormattedMessage
          id="theme-switcher.theme"
          defaultMessage="{theme} theme"
          values={{ theme }}
        />
      </label>
    </article>
  );
};

ThemeSwitcher.propTypes = {
  switchTheme: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
}

export default ThemeSwitcher;
