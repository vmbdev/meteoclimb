/**
 * @module CloseButton
 */
import React from 'react'
import './close-button.scss';

/**
 * JSX Component representing a close button.
 * @param {Object} props
 * @param {Function} props.closeAction  Called when the button is clicked.
 * @returns The rendered JSX Component.
 */
const CloseButton = ({ closeAction }) => {

  return (
    <button className="closebutton" onClick={ closeAction }>
      &#10006;
    </button>
  );
}

export default CloseButton;