import React from 'react';
import Brand from './brand.js';
import './navbar.scss';

const Navbar = (props) => {

  return ( 
    <nav className="navbar">
      <div className="navbar__left">
        <Brand />
      </div>
      <div className="navbar__right">
        { props.children }
      </div>
    </nav>
  );
};

export default Navbar;