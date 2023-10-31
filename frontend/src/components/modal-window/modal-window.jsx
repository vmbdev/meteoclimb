/**
 * @module ModalWindow
 */
import React from 'react'
import CloseButton from '../close-button/close-button.jsx';
import './modal-window.scss';

/**
 * JSX Component representing a modal window.
 * @param {Object} props
 * @param {boolean} props.active  The modal window is active and visible.
 * @param {JSX.Element} props.children
 * @param {Function} props.closeAction  Event emitted when the user closes the
 *     modal.
 * @returns The rendered JSX Component.
 */
const ModalWindow = ({ active, children, closeAction}) => {
  const isActive = () => {
    return `${active ? 'modalwindow--active' : ''}`;
  }

  return (
    <div className={ `modalwindow ${isActive()}` }>
      <CloseButton closeAction={ closeAction } />
      <div className="modalWindow__content">
        { children }
      </div>
    </div>
  );
}

export default ModalWindow;