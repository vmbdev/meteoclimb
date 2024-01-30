import React from 'react';
import PropTypes from 'prop-types';

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

Footer.propTypes = {
  children: PropTypes.node,
}

export default Footer;
