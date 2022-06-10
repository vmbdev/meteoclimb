import React from 'react';
import './navbar.scss';

const Navbar = (props) => {

  return ( 
    <nav className="navbar">
      { props.children }
    </nav>
  );
};

export default Navbar;