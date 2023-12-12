import React, { useState } from 'react';
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
    <div className="settings-menu">
      <div className="settings-menu__icon" onClick={toggleMenu}></div>

      <div className={`settings-menu__list ${menuClass()}`}>
        {children}
      </div>
    </div>
  )
}

export const SettingsItem = ({ children }) => {
  return (
    <div className="settings-item">
      {children}
    </div>
  )
}

export default Settings;
