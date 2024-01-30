import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './settings-menu.scss';

const Settings = ({ children }) => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  }

  const menuClass = () => {
    return `settings-menu__list--${menuActive ? 'visible' : 'hidden'}`;
  }

  return (
    <article className="settings-menu">
      <div className="settings-menu__icon" onClick={toggleMenu}></div>

      <div className={`settings-menu__list ${menuClass()}`}>
        {children}
      </div>
    </article>
  )
}

Settings.propTypes = {
  children: PropTypes.node.isRequired,
}

export const SettingsItem = ({ children }) => {
  return (
    <article className="settings-item">
      {children}
    </article>
  )
}

SettingsItem.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Settings;
