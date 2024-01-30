import React from 'react';
import PropTypes from 'prop-types';

import Brand from './brand/brand.jsx';
import './navbar.scss';

/**
 * JSX Component representing a navigation bar with horizontal elements.
 * @param {Object} props
 * @param {Object[]} props.children
 * @returns The rendered JSX Component.
 */
const Navbar = ({ children }) => {
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Brand />
      </div>
      <div className="navbar__right">
        {children}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  children: PropTypes.node,
}

export default Navbar;
