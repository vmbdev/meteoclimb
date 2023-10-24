import React from 'react';
import './footer.scss';

const Footer = (props) => {

  return (
    <footer className="footer">
      { props.children }
    </footer>
  );
}

export default Footer;