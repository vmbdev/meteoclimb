import React from 'react';

import './footer.scss';

/**
 * JSX Component representing a footer sticked to the bottom.
 * @param {Object} props
 * @param {Object[]} props.children
 * @returns The rendered JSX Component.
 */
const Footer = ({ children }) => {
  return <footer className="footer">{children}</footer>;
};

export default Footer;
